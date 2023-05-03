class api {
	
	constructor(apiUrl) {
		
		this.apiUrl = apiUrl;
		
	}
	
	async getData() {
		
		try {
			
			return await fetch(this.apiUrl).then(response => response.json()).then(data => data.content);
		} catch (err) {
			
			console.error(err);
			return null;
			
		}
	}
}

module.exports = api