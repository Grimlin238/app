const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, { useUnifiedTopology: true });
let database;

async function connect(dbName) {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to ${dbName}`);
    return db;
  } catch (error) {
    console.error(error);
  }
}

database = {
  async get(dbName) {
    if (!database) {
      database = await connect(dbName);
    }
    return database;
  },

  async close() {
    try {
      await client.close();
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = database;
 