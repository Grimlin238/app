/**
dbManager.js
Authors:
Jonah Szymanski (Majority of code)
Tyion Lashley (One method, and packaged the file for NPM)
The dbManager file includes method for communicating with the db and retrieving collections
The DB itself created by Jonah Szymanski
*/

// Jonah: Import the MongoClient class and set the database URL
const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';

// Jonah: Create a new MongoClient instance and a variable to store the db object
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

// Jonah: connect to the MongoDB database
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

// Jonah: An object with methods for accessing the db and its collections
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

// Jonah: An async method to close the DB connection
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