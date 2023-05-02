const db = require('databasemanager')
const express= require('express');
const userRouter = require('./routes/user')

const app = express();
app.use(express.urlencoded({
  extended: true
}));

app.use("/user", userRouter)

app.use(express.json())

async function addUser(name, pass) {
  try {
    const base = await db.get('wordGame');
    const collection = await db.getCollection('users');
    const result = await collection.insertOne({
      username: name,
      password: pass 
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function findUser(user, pass) {
	
	try {
		
		const base = await db.get('wordGame')
		
		const collection = await db.getCollection('users')
		
		const doc = await collection.find({
			
			username: user,
			password: pass
		}).toArray();
		
		if (doc.length > 0) {
			
			return true
			
		} else {
			
			return false;
			
		}
	} catch(error) {
		
		console.log(error);
		
	} finally {
		
		await db.close()
		
	}
}

async function addScore(userName, score) {
  try {
    const base = await db.get('wordGame');
    const usersCollection = await db.getCollection('users');
    const user = await usersCollection.findOne({ username: userName });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    const scoresCollection = await db.getCollection('scores');
    const newScore = {
      score: score,
      user_id: user._id
    };
    
    const result = await scoresCollection.insertOne(newScore);
    console.log('Score ${score} added for user ${user.username}');
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
}

async function getScore(userName) {
  try {
    const base = await db.get('wordGame');
    const usersCollection = await db.getCollection('users');
    const user = await usersCollection.findOne({ username: userName });
    
    if (!user) {
      console.log('User not found');
      return 0;
    }
    
    const scoresCollection = await db.getCollection('scores');
    const userScore = await scoresCollection.findOne({ user_id: user._id });
    
    if (!userScore) {
      console.log('Score not found');
      return 0;
    }
    
    console.log('Score for user ${user.username}: ${userScore.score}');
    return userScore.score;
  } catch (error) {
    console.log(error);
    return 0;
  } finally {
    await db.close();
  }
}

var globalUser = "" // This will hold the user name when accessing it in local scopes
app.get('/', (req, res) => {
  res.send('<h1> Welcome to insert app name </h1> <ul> <li> <a href="/create"> Create an account </a> </li></li> <a href="/login"> Log in </a> </li> </ul>');
});

app.get('/create', (req, res) => {
 
  res.send('<h1> Create an account </h1><form method="post"><h2> User Name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Create Account" onclick="createAccount()"></form>');
});

app.get('/dashboard', (req, res) => {
	
	res.send('<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Ready to start playing? </h1> <a href="/game"> Play Now! </a>')
})

app.get('/profile', async (req, res) => {
	let wpm = await getScore(globalUser)
	res.send('<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav> <h1> Welcome to your profile </h1><br><h1> Profile Information</h1><p> Username: @' + globalUser + ' </p><br><p> WPM (Words Per Minute): ' + wpm + ' </p>')
	
})

app.get('/leaderboard', (req, res) => {
	
	res.send('<nav style="background-color: blue;"> <a href="/dashboard"> Home </a> <a href="/profile"> Profile </a> <a href="/leaderboard"> Leader Board </a> </nav>')
	
})

app.get('/login', (req, res) => {
  res.send('<h1> Log in </h1><form method="post"><h2> User name </h2><input name="userName"><h2> Password </h2><input name="passWord"><input type="submit" value="Log in"></form>');
});

app.post('/create', async (req, res) => {
  const userName = req.body.userName;
  const pass = req.body.passWord;
  await addUser(userName, pass);
  await addScore(userName, 0)
  globalUser = userName;
  
  res.send('<h1> Account created </h1> <p> Click continue to go to your dashboard </p> <a href="/dashBoard" target="_blank"> Continue </a>')
});

app.post('/login', async (req, res) => {
	
	const user = req.body.userName;
	
	const pass = req.body.passWord;
	
	const isFound = await findUser(user, pass)
	
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

 