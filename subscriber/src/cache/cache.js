import redis from 'async-redis';

class Cache {

    async connect() {
		let client = redis.createClient();
		client.on('error', (err) => {
			console.log('Error while connecting ', err)
		});
		return client;
	}
    
    async saveMessage(message) {
        try {
            let client = redis.createClient();
            
			client.on('error', (err) => {
				console.log('Error ' + err);
            });
            
			let model = {
				hash: message.hash,
				realURL: message.url
			};
			await client.set(model.hash.toString(), model.realURL.toString());
			const value = await client.get(model.hash.toString());
			return value;
		} catch (error) {
            console.log(error);
		}
    }

    async removeMessage(key) {
        console.log('KEY: ', key);
        let client = redis.createClient();
		client.on('error', (err) => {
			console.log('Error ' + err);
		});
		await client.del(key);
		const value = await client.get(key);
		return value;
    }

    
	async keyExists(key) {
		let client = redis.createClient();
		client.on('error', (err) => {
			console.log('Error ' + err);
		});
		let res = await client.get(key.toString());
		return res;
	}
}


export default new Cache();