class ShortenUrl {
	async shortenURL(url) {
		try {
			let path = process.env.REDIRECTION_URL || `http://localhost:4000/redirection/`;
            let hash = this.generateHash();
            let shortUrl = path + hash;
            let model = {
                'url': url,
                'short': shortUrl,
                'hash': hash
			};
            return model;
		} catch (error) {
			throw error;
		}
	}

	generateHash() {
		let hash = '';
		let pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < 5; i++)
			hash += pattern.charAt(Math.floor(Math.random() * pattern.length));
		return hash;
	}
}

export default new ShortenUrl();