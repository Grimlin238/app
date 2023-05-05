/**
api.js
Author: Tyion Lashley
This file manages grabing data from the api
*/

class api {
	
	constructor(apiUrl) {
		
		this.apiUrl = apiUrl;
		
	}
	
/**
	Tyion:
	Method to get data from api
	*/
		
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