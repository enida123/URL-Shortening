import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import urlShoretenerController from './controller/UrlShortenerController';
class Server {
	constructor(options = {}) {
		this.port = options.port || 3000;
        this.app = express();
		this.server = http.createServer(this.app);
	}

	start() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({
			extended: true,
		  }));


		this.app.post('/shortener', urlShoretenerController.create);
		this.app.delete('/shortener', urlShoretenerController.delete);
		this.server.listen(this.port, () => {
		    console.log('Server listening on port: ' + this.port);
		});
	}
}

export default new Server();