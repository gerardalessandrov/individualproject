const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;
dotenv.config();
let database;
const initDb = (callback) => {
  if (database) {
    console.log("Database is initialized");
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client;
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};
const getDatabase = () => {
  if (!database) {
    throw Error("Database is not initialized");
  }
  return database;
};
module.exports = {
  initDb,
  getDatabase,
};
