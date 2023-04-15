let express= require('express');

let app = express();

app.get('/', (req, res) => {
	
res.send('<h1> Welcome to insert app name </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

app.get('/create', (req, res) => {
	
	res.send('<h1> Create an account </h1><form method="post"><h2> First Name </h2><input name="FirstName"><h2> Last name </h2><input name="LastName"><h2> User name </h2><input name="UserName"><input type="submit" value="Create Account"></form>');
});

app.get('/login', (req, res) => {
	
	res.send('<h1> Log in <h1><form method="post"><h2> User name </h2><input name="USerName"><input type="submit" value="Log in"></form>');
});

app.listen(8080, () => {
	
	console.log("I'm listening on port 8080");
	
});