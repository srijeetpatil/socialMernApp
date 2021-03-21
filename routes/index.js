var express = require("express");
var router = express.Router();
var Post = require("../models/Post");

router.route("/").get((req, res, next) => {
  Post.find()
    .populate("author", "email username")
    .exec((err, result) => {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Unexpected error" });
        return next(err);
      } else {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(result);
      }
    });
});

module.exports = router;
