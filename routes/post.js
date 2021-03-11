var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Post = require("../models/Post");
var mongoose = require("mongoose");

router
  .route("/")
  .post((req, res, next) => {
    let data = req.body;
    let caption = data.caption;
    let token = req.headers.authorization;
    User.findOne({ token: token }, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Something went wrong" });
        return next(err);
      } else if (result) {
        let id = result._id;
        let newPost = new Post({
          _id: new mongoose.Types.ObjectId(),
          caption: caption,
          author: id,
        });
        newPost.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-type", "application/json");
            res.json({ error: "Something went wrong" });
            return next(err);
          }
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json({ message: "success" });
        });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Provide the right authorization details" });
      }
    });
  })

  .get((req, res, next) => {
    let data = req.body;
    let postId = data.postId;
    Post.findById(postId)
      .populate("author")
      .exec((err, result) => {
        if (err) return next(err);
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(result);
      });
  });

module.exports = router;
