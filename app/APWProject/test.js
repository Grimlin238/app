let testHandle = require("DbHandler")

 
async function tester() {
	
	let found = await testHandle.findOneUser('NoProbBob')
if (found)
	
{
	
	console.log("Not found");
	
}

else {
	
	console.log("Not found");
	
}

}

tester()