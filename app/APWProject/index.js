let dbManager = require('databasemanager')
let express= require('express');
const userRouter = require('./routes/user')

let app = express();
app.use(express.urlencoded({
	extended: true 
}))

app.use("/user", userRouter)

app.use(express.json())

async function addUser(name, pass) {
	try {
	const wordGame = dbManager.get('wordGame');
	
	const collection = wordGame.collection('users');
	const result = await collection.insertOne({
		
		username: name, 
		
		password: pass 
	}); 
	await dbManager.close();
} catch (err) {
	
	console.error(err);
	
	throw err;
}
}

app.get('/', (req, res) => {
	
	res.send('<h1> Welcome to insert app name </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

app.get('/create', (req, res) => {
	
	res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account" onclick="createAccount()"></form>');
 
});

app.get('/login', (req, res) => {
	
	res.send('<h1> Log in </h1><form method="post"><h2> User name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Log in"></form>');
});

app.post('/create', async (req, res) => {
	
	const userName = req.body.userName;
	
	const pass = req.body.passWord;
	
	await addUser(userName, pass);
	res.send('<h1> Account created </h1> <p> Click continue to go to your dashboard </p> <a href="/dashBoard" target="_blank"> Continue </a>')
});

/**
app.post('/login', (req, res) =>

{
	
	const{userName, passWord} = req.body;
	
	// Check if user name and passowrd is correct
	
})
*/
app.listen(3000, () => {
	
	console.log("I'm listening on port 3000");
	
});