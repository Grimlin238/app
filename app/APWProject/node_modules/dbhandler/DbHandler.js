/**
DbHandler.js
Author: Tyion Lashley
This file handles adding, updating, and grabing data from collections
in the wordGame db
*/

var db = require('databasemanager')

class DbHandler {
	
/**
	Tyion:
	The following method adds a user to the database
	*/
		
	static async addUser(name, pass) {
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
/**
Tyion:
The following method finds a user in the db
This is useful for looking up a user in the db
while on the leaderpage
*/

static async findOneUser(user) {
	
	try {
		
		const base = await db.get('wordGame')
		
		const collection = await db.getCollection('users')
		
		const userResult = await collection.findOne({ username: user });
		
		if (userResult) {
			
			return true;
			
		} else {
			return false;
			
		}
	} catch (err) {
		
		console.log(err)
		
	}
}

/**
Tyion:
The following method looks up a user in the db
This will be used on the log in page
*/

static async findUser(user, pass) {
	
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
		
	}
	
}

/**
Tyion:
The following method is used for adding a score to the db for a specific user
Useful on account creation
when giving a user an initial score
*/

static async addScore(userName, score) {
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
      username: user._id
    };
    
    const result = await scoresCollection.insertOne(newScore);
    console.log('Score ${score} added for user ${user.username}');
  } catch (error) {
    console.log(error);
  }
  
}

/**
Tyion:
The following method updates a users score after a wpm is calculated
on the gave page
*/

static async updateScore(forUser, withScore) {
	
	try {
		
		const base = await db.get('wordGame')
		
		const userCol = await db.getCollection('users')
		
		const scoreCol = await db.getCollection('scores')
		
		const userRes = await userCol.findOne({
			
			username: forUser
			
		});
		
		if (!userRes) {
			
			console("I can't seem to find that user")
			
		}
		
		const scoreRes = await scoreCol.updateOne({username: userRes._id}, { $set: { score: withScore}});
		
	} catch(err) {
		
		console.log(err)
		
	}
	
}

/**
Tyion:
The following method gets a score for a scpecific user
*/

static async getScore(userName) {
  try {
    const base = await db.get('wordGame');
    const usersCollection = await db.getCollection('users');
	const scoresCollection = await db.getCollection('scores');
	
    const user = await usersCollection.findOne({ username: userName });
    
    if (!user) {
      console.log('User not found');
      return 0;
    }
    
     
    const score = await scoresCollection.findOne({ username: user._id });
	
    if (!score) {
      console.log('Score not found');
    }
    
    return score.score;
  } catch (error) {
    console.log(error);
    return 0;
  }
  
}

/**
Tyion:
The following method prints the top tne scores in the db
useful for the leaderboard page
*/

static async leaderBoard() {
	try {
		const base = await db.get('wordGame');
		
		const scoreCollection = await db.getCollection('scores')
		
		const topTen = await scoreCollection.aggregate([
			{ $lookup: { from: 'users', localField: 'username', foreignField: '_id', as: 'user' } },
		 { $unwind: '$user' },
		{ $sort: { score: -1 } },
		{ $limit: 10 }, 
		{ $project: { _id: 0, username: '$user.username', score: 1 } }
	
	]).toArray();
	
	return topTen;
	
	} catch(error) {
		
		console.log(error)
		return []
	}
	 
}
}

module.exports = DbHandler;