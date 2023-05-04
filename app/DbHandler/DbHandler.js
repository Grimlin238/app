var db = require('databasemanager')

class DbHandler {
	
	
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