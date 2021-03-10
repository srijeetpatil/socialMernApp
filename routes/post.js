var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb://localhost:27017/",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  function (err, client) {
    if (err) throw err;
    var db = client.db("test");

    router.get("/", (req, res, next) => {
      db.collection("data")
        .find({}, { _id: 0 })
        .toArray((err, result) => {
          if (err) next(err);
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(result);
        });
    });

    router.post("/", (req, res, next) => {
      let data = req.body;
      let name = data.name;
      let pincode = data.pincode;
      if (name && pincode) {
        db.collection("Student").insertOne(data, (error, response) => {
          if (error) next(error);
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json(response);
        });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Invalid data" });
      }
    });

    router.put("/", (req, res, next) => {
      let data = req.body;
      let id = data.id;
      let name = data.name;
      let pincode = data.pincode;
      db.collection("data").findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, upsert: true, remove: false, projection: {} },
        (err, result) => {
          if (err) return next(err);
          console.log(result);
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json({ message: "success" });
        }
      );
    });

    router.delete("/", (req, res, next) => {
      let data = req.body;
      let id = data.id;
      res.statusCode = 400;
      res.setHeader("Content-type", "application/json");
      res.json({ error: "Cannot remove from capped collection" });
    });
  }
);

module.exports = router;
