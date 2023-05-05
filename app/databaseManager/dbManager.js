/**
dbManager.js
Authors:
Jonah Szymanski
Tyion Lashley
The dbManager file includes method for communicating with the db and retrieving collections
*/
 const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

async function connect(dbName) {
  try {
    await client.connect();
    const database = client.db(dbName);
    console.log(`Connected to ${dbName}`);
    return database;
  } catch (error) {
    console.error(error);
  }
}

const database = {
  async get(dbName) {
    if (!db) {
      db = await connect(dbName);
    }
    return db;
  },
/**
  Tyion:
  The following method gets a collection and returns it
  */
  
async getCollection(collectionName) {
    if (!db) {
      throw new Error('A database connection has not been established');
    }
    return db.collection(collectionName);
  },

  async close() {
    try {
      await client.close();
      console.log('Connection closed');
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = database;