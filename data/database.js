const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://0.0.0.0:27017");
  database = client.db("online-shop"); // creating a new database by that name
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first!"); // if databast isnt found
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
