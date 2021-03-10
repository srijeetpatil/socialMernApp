var MongoClient = require("mongodb").MongoClient;
var db;

MongoClient.connect("mongodb://localhost:27017/", function (err, client) {
  if (err) throw err;
  db = client.db("test");
});

module.exports = db;
