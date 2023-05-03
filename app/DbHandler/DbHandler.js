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
  } finally {
  	
	  await db.close();
	  
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
		
	} finally {
		
		await db.close()
		
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
		
		const scoreRes = await scoreCol.updateOne({user_id: userRes._id}, { $set: { score: withScore}});
		
	} catch(err) {
		
		console.log(err)
		
	} finally {
		
		await db.close();
		
	}
}

static async getScore(userName) {
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


static async leaderBoard() {
	try {
	const base = await db.get('wordGame')
const users = await db.getCollection('users')	
	const collection = await db.getCollection('scores')
	
	const top = await collection.find().sort({score: -1 }).limit(10).toArray();
	const leader = await Promise.all(top.map(async (score) => {
		const user = await users.findOne({_id:score.user._id});return {
			username: user.username, score:score.score
		}; 
	}))
	return leader;
	} catch(error) {
		
		console.log(error)
		return []
	} finally {
		
		await db.close();
		
	} 
}
}

module.exports = DbHandler;