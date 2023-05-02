const express = require('express')
const handler = require('DbHandler')
const app = express();

app.use(express.urlencoded({
	extended: true
}))
app.use(express.json())

var globalUser = "" // This will hold the user name when accessing it in local scopes

app.get('/', (req, res) => {
  res.send('<h1> Welcome to insert app name </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

app.get('/create', (req, res) => {
 
  res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account"></form>');
});

app.get('/dashboard', (req, res) => {
	
	res.send('<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Ready to start playing? </h1> <a href="/game"> Play Now! </a>')
})

app.get('/profile', async (req, res) => {
	let wpm = await handler.getScore(globalUser)
	res.send('<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Welcome to your profile </h1><br><h1> Profile Information</h1><p> Username: @' + globalUser + ' </p><br><p> WPM (Words Per Minute): ' + wpm + ' </p>')
	
})

app.get('/leaderboard', async (req, res) => {
	
	let leaderPage = '<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Find your friends by their username </h1> <form method="post"> <h2> Enter username without the @ sign <h2> <input name="user"> <input type="submit" value="Search"> </form> <h3> Are you on the leader board? </h3> <ol>'
	
	let userAndScore = await handler.leaderBoard();
	
	for (let i = 0; i < userAndScore.length; i++) {
		
		leaderPage += '<li> User: @' + userAndScore[i].username + ' - WPM: ' + userAndScore.score + ' </li>'
	}
	
	leaderPage += '</ol>'
	
	res.send(leaderPage)
	
})

app.get('/login', (req, res) => {
  res.send('<h1> Log in </h1><form method="post"><h2> User name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Log in"></form>');
});

app.post('/create', async (req, res) => {
  const userName = req.body.userName;
  const pass = req.body.passWord;
  await addUser(userName, pass);
  await handler.addScore(userName, 0)
  globalUser = userName;
  
  res.send('<h1> Account created </h1> <p> Click continue to go to your dashboard </p> <a href="/dashBoard" target="_blank"> Continue </a>')
});

app.post('/leaderboard', async (req, res) => {
	
	const user = req.body.user
const isFound = await handler.findOneUser(user)
	
	if (isFound) {	
	const score = await handler.getScore(user)
	
	res.send('<h1> Result </1> <p> user: ' + user + 'sWPM: ' + score + '</p> <a href="/leaderboard"> Go Back to leader Board </a>')
} else {
	
	res.send('<h1> Oops, we ran into a snag </h1> <p> We could not find the user name you were looking for, </p> <a href="/headerboard"> Go Back To Leader Board </a>')
}
})

app.post('/login', async (req, res) => {
	
	const user = req.body.userName;
	
	const pass = req.body.passWord;
	
	const isFound = await handler.findUser(user, pass)
	
	if (isFound) {
		globalUser = user;
				
		res.send('<h1> Welcome back <h1> <p> Click continue to go to your dashboard </p> <a href="/dashboard"> Continue </a>')
	} else {
		
		res.send('<h1> Oops, we could not find your account </h1> </p> Sorry buddy. We can not seem to find your account in our database. Try going back and making sure your info is inserted properly. </p> <p> Remember, capital letters matter. </p> <a href="/login"> Go back to login </a>')
	}
})
app.listen(8080, () => {
  console.log("I'm listening on port 8080");
});

 