import db from '../database-config/dbconfig';
import shortener from '../helper/shortenUrl';
import sender from '../rabbitmq/sender';
import urlValidator from 'valid-url';

class UrlShortenerController {
    async create(req, res) {
        try {

            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                return res.status(400).send("Url missing");
            }
    
            const data = req.body;
    
            if (!urlValidator.isUri(data.url) && !urlValidator.isHttpUri(data.url) && !urlValidator.isHttpsUri(data.url)) {
                return res.status(400).send("Url is not valid");
            }
    
            const dbConnection = await db.pool.getConnectionAsync();
            const shortened = await shortener.shortenURL(data.url);
    
            const insertUrlQuery = `INSERT INTO urls (url, short, hash) VALUES
                                       ('${shortened.url}','${shortened.short}', 
                                        '${shortened.hash}')`;
    
            const result = await dbConnection.queryAsync(insertUrlQuery);
    
            let response = {};
            if (result) {
    
                const getLastInserted = `SELECT url,short,hash FROM urls WHERE id = ${result.insertId}`;
                const [lastInserted] = await dbConnection.queryAsync(getLastInserted);
                const last = JSON.parse(JSON.stringify(lastInserted));
    
                response = {
                    url: last.url,
                    short: last.short,
                    hash: last.hash,
                    isDeleted: false
                };
            } else {
               return res.status(400).send("Error while inserting data");
            }
    
            await sender.sendMessage(response);
    
            res.send(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            const dbConnection = await db.pool.getConnectionAsync();

            const geturl = `SELECT id, hash FROM urls WHERE id = ${id}`;
            const [urlmodel] = await dbConnection.queryAsync(geturl);

            if (!urlmodel) {
                return res.status(404).send("Url not found");
            }

			const deleteUrlQuery = `DELETE FROM urls WHERE id = ${id}`;
            const result = await dbConnection.queryAsync(deleteUrlQuery);
            
            let message = {};
			if (result) {
                message = {
                    id: urlmodel.id,
                    hash: urlmodel.hash,
                    isDeleted: 1
                }
			} else {
				throw new Error('Error while deleting');
			}

            await sender.sendMessage(message);

            res.sendStatus(204);
        } catch (err) {
            res.status(500);
            res.send(err);
        }
    }
}


export default new UrlShortenerController();