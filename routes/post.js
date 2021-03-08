var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/", function (err, client) {
  if (err) throw err;
  var db = client.db("test");
  db.collection("Student")
    .find()
    .toArray(function (err, result) {
      if (err) throw err;

      console.log(result);
    });
});

router.get("/", (req, res, next) => {
  let obj = {
    auth: "John",
    status: 405,
  };
  res.send(obj);
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);
  res.sendStatus(200);
});

module.exports = router;
