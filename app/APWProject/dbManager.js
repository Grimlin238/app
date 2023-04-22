const MongoClient = require('mongodb').MongoClient;
var getID = require('mongodb').ObjectID();
var url = "mongodb://127.0.0.1:27017/";
let database = {};
let mongoClient = MongoClient(url, { useUnifiedTopology: true });
let myDB;


var connect = async function (dbName) {
    try {
        await mongoClient.connect();

        myDB = mongoClient.db(dbName);

        if (!myDB) {
            throw new Error("DB Connection Failed to start!");
        }
        else {
            console.log(`Connected to ${dbName}`);
            return myDB;
        }
    } catch (e) {
        console.log(e.message);
    }
}

database.get = function (dbName) {
    if (myDB) {
        console.log("Already connected!");
        return myDB;
    } else {
        return connect(dbName);
    }
}

database.close = async function () {

    try {
        await mongoClient.close();
        return;
    } catch (e) {
        console.log(e.message);
    }
}

module.exports = database;