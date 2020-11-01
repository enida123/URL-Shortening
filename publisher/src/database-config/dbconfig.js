/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import mysql from 'mysql';

class DbConnectionService {
	constructor() {
		this.pool = mysql.createPool({
			host: 'localhost',
			user: process.env.MYSQL_USER || 'root',
			password: process.env.MYSQL_PASSWORD || 'root',
			database: process.env.MYSQL_DATABASE || 'shortenerdb',
			port: 3306
		});
	}
}

export default new DbConnectionService();
