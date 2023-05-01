let dbManager = require('databasemanager')
let express= require('express');
const userRouter = require('./routes/user')

let app = express();
app.use(express.urlencoded({
	extended: true 
}))

app.use("/user", userRouter)

app.use(express.json())

const users = []

app.get('/', (req, res) => {
	
	res.send('<h1> Welcome to insert app name </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

app.get('/create', (req, res) => {
	
	res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account" onclick="createAccount()"></form>');
	res.json(users)
});

app.get('/login', (req, res) => {
	
	res.send('<h1> Log in </h1><form method="post"><h2> User name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Log in"></form>');
});

app.post('/create', (req, res) => {
	
	const{userName, passWord} = req.body;
	
	if (userName === "" && passWord === "") {
	
		res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account"></form> <h2> Error creating account. Please go back and ensure all fields are inserted. </h2>');
		//"Error creating ccount. Please go back and ensure all fields are inserted"
		//<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account"></form> <h2> Error creating account. Please go back and ensure all fields are inserted </h2>
	}
	
	// Below this comment
	// please add user name to database as well as password
	//
	const user = { name: req.body.name, password: req.body.password }
    users.push(user)
	
		
		// database handling code goes here
		// I will continue where you left off afterwords

})

app.post('/login', (req, res) =>

{
	
	const{userName, passWord} = req.body;
	
	// Check if user name and passowrd is correct
	
})

app.listen(8080, () => {
	
	console.log("I'm listening on port 8080");
	
});