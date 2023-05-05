/**
index.js
author: TyionLashley
This file puts all the pieces together to make the app work.
*/

const express = require('express')
const handler = require('DbHandler')
const api = require('api')
const app = express();
const aPi = new api('http://api.quotable.io/random') 

app.use(express.urlencoded({
	extended: true
}))
app.use(express.json())

var globalUser = "" // This will hold the user name when accessing it in local scopes
var globalScore = 0; // This will hold a score when in the game
var phrase = ''
/**
Tyion:
Creating the game page and calculating words per minutes
*/

app.get('/game', async (req, res) => {
	// Grabbing phrase from API 	
	phrase = await aPi.getData();
	
	let timer = Date.now(); // setts a timer
	
	let gamePage = '<nav style="background-color: DodgerBlue; color: white;"> <a href="/dashboard"> Leave and go back to dashboard </a> </nav> <h1> Let us begin! </h1> <form method="post"> <h1> Enter the phrase below: </h1> <p> WPM: <span id="wpm">' + globalScore + '</span> </p> <p> Phrase: ' + phrase + '</p> <label for="entry"> Answer: </label> <input type="text" id="entry" name="entry"> <input type="hidden" id="start-time" name="startTime" value="' + timer + '"> <input type="submit" value="submit">  </form> <script> var time = setInterval(function() { var startTime = parseInt(document.getElementById("startTime").value); var elapsedTime = Date.now() - startTime; var wordsEntered = document.getElementById("entry").value.split(" ").length; var wpm = Math.round(wordsEntered / (elapsedTime / 1000 / 60));  document.getElementById("wpm").innerHTML = isNaN(wpm) ? 0 : wpm; }, 1000); </script>';
	     
	res.send(gamePage)
})


/**
Tyion and Abner:
Creating main route
with options to login and create account
*/

app.get('/', (req, res) => {
  res.send('<h1> Welcome to TypeTonic </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

/**
Tyion and Abner:
Creating create account page
*/

app.get('/create', (req, res) => {
 
  res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input type="password" name="passWord"><input type="submit" value="Create Account"></form>');
});

/**
Tyion:
Creating dashboard
*/

app.get('/dashboard', async (req, res) => {
globalScore = await handler.getScore(globalUser)
	res.send('<nav style="background-color: DodgerBlue; color: white:"> <a href="/login"> Log Out </a> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Ready to start playing? </h1> <a href="/game"> Play Now! </a>')

})

/**
Tyion and Abner:
Creating profile page
*/

app.get('/profile', async (req, res) => {
	let wpm = await handler.getScore(globalUser)
	res.send('<nav style="background-color: DodgerBlue; color: white;"> <a href="/login"> Log Out </a> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Welcome to your profile </h1><br><h1> Profile Information</h1><p> Username: @' + globalUser + ' </p><br><p> WPM (Words Per Minute): ' + wpm + ' </p>')
	
})
/**
Tyion:
Creating leaderboard with option to search for user
*/

app.get('/leaderboard', async (req, res) => {
	
	var userScores = await handler.leaderBoard();
	
	var leaderPage = '<nav style="background-color: DodgerBlue; color: white:"> <a href="/login"> Log Out </a> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Find your friends by their username </h1> <form method="post"> <h2> Enter username without the @ sign <h2> <input name="user"> <input type="submit" value="Search"> </form> <h3> Are you on the leader board? </h3> <ol>'
	
	for (let i = 0; i < userScores.length; i++) {
		const {username, score} = userScores[i];
		
		leaderPage += '<li> User: @' + username + ' - WPM: ' + score + ' </li>'
	}
	
	leaderPage += '</ol>'
	
	res.send(leaderPage)
	
})
/**
Tyion:
Creating login page
*/

app.get('/login', (req, res) => {
  res.send('<h1> Log in </h1><form method="post"><h2> User name </h2><input name="userName"><h2> Password </h2><input type="password" name="passWord"><input type="submit" value="Log in"></form>');
});

/**
Tyion:
Handling data from /game in post request
*/

app.post('/game', async (req, res) => {
	
	const entry = req.body.entry;
	
	
	const startTime = req.body.startTime;
	let timeElapsed = Date.now() - startTime;
	
	let wordsEntered = entry.split(' ').length;
	 
	let wpm = Math.round(wordsEntered / (timeElapsed / 1000 / 60));
	
	if (wpm > globalScore) {
	globalScore = wpm;
	
	await handler.updateScore(globalUser, wpm);
}

	if (entry === phrase) {
		res.redirect('/game');		
	} else {
		res.send('<h1> Sorry! That is not correct. </h1> <p> Click keep playing or back to dash to return to the dashboard </p> <a href="/game"> Keep Playing! </a> <a href="/dashboard"> Back To Dashboard </a>')
 
	}
})

/**
Tyion and Abner:
Handling information sent from /create user route in post request
User should not be able to create account if one already exists
*/

app.post('/create', async (req, res) => {
  const userName = req.body.userName;
  const pass = req.body.passWord;
  const isInDB = await handler.findUser(userName, pass)
  
  if (isInDB) {
  	
	res.send('<h1> Account already created </h1> <p> That account already exists </p> <a href="/create"> Return to create account </a> <p> or </p> <a href="/login"> Go To login </a>')
  } else {
  await handler.addUser(userName, pass);
  
  await handler.addScore(userName, 0);
  globalUser = userName;
  
  res.send('<h1> Account created </h1> <p> Click continue to go to your dashboard </p> <a href="/dashBoard" target="_blank"> Continue </a>')
}
})

/**
Tyion:
Handling user search in post request
*/

app.post('/leaderboard', async (req, res) => {
	
	const user = req.body.user
const isFound = await handler.findOneUser(user)
	
	if (isFound) {	
	const score = await handler.getScore(user)
	
	res.send('<h1> Result </1> <p> user: ' + user + 'WPM: ' + score + '</p> <a href="/leaderboard"> Go Back to leader Board </a>')
} else {
	
	res.send('<h1> Oops, we ran into a snag </h1> <p> We could not find the user name you were looking for, </p> <a href="/leaderboard"> Go Back To Leader Board </a>')
}
})

/**
Tyion and Abner:
Handling login from from post request
redirecting user to dashboard after logging in
*/

app.post('/login', async (req, res) => {
	
	const user = req.body.userName;
	
	const pass = req.body.passWord;
	
	const isFound = await handler.findUser(user, pass)
	
	if (isFound) {
		globalUser = user;
 
res.redirect('/dashboard')
	} else {
		
		res.send('<h1> Oops, we could not find your account </h1> </p> Sorry buddy. We can not seem to find your account in our database. Try going back and making sure your info is inserted properly. </p> <p> Remember, capital letters matter. </p> <a href="/login"> Go back to login </a>')
	}
})
app.listen(8080, () => {
  console.log("I'm listening on port 8080");
});

 