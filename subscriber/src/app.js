import express from 'express';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import http from 'http';
import redirectionController from './controller/RedirectionController';

class Server {
    constructor() {
        this.port = 4000;
        this.app = express();
		this.server = http.createServer(this.app);
    }

    start() {
        const limiter = this.setLimiter();
        this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({
			extended: true,
          }));
          
        this.app.get('/redirection/:url', limiter, redirectionController.get);

        this.server.listen(this.port, () => {
		    console.log('Server listening on port: ' + this.port);
		});
    } 

    setLimiter() {
        const limiter = rateLimit({
			windowMs: 120000, 
			max: 10,
			message: 'Request limit reached...please wait 120 seconds'
        });
        
        return limiter;
    }
}

export default new Server();