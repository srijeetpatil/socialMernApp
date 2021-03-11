var express = require("express");
var router = express.Router();
var Crypto = require("crypto-js");
var mongoose = require("mongoose");

var User = require("../models/User");

router.get("/", (req, res, next) => {
  let data = req.body;
  if (data.token) {
    User.findOne({ token: data.token }, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Unexpected error" });
      } else if (result) {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(result);
      } else {
        res.statusCode = 404;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "User not found" });
      }
    });
  }
});

router.get("/login", (req, res, next) => {
  res.statusCode = 405;
  res.setHeader("Content-type", "application/json");
  res.json({ message: "method not allowed" });
});

router.post("/login", (req, res, next) => {
  let data = req.body;
  let email = data.email;
  let password = data.password;
  if (email && password) {
    User.findOne({ email: email }, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Unexpected error" });
      } else if (result) {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(result);
      } else {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "You need to signup first" });
      }
    });
  } else {
    res.statusCode = 400;
    res.setHeader("Content-type", "application/json");
    res.json({ error: "Invalid data" });
  }
});

router.get("/signup", (req, res, next) => {
  res.statusCode = 405;
  res.setHeader("Content-type", "application/json");
  res.json({ message: "method not allowed" });
});

router.post("/signup", (req, res, next) => {
  let data = req.body;
  let email = data.email;
  let password = data.password;
  if (email && password) {
    User.findOne({ email: email }, (err, result) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Unexpected error" });
      } else if (result) {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Account with this email already exists" });
      } else {
        var hash = Crypto.AES.encrypt(
          email + password,
          "qweaSASdfEwmmavOppkfa"
        ).toString();
        let newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          password: password,
          token: hash,
        });

        newUser.save((err) => {
          if (err) return next(err);

          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json({ message: "Success" });
        });
      }
    });
  } else {
    res.statusCode = 400;
    res.setHeader("Content-type", "application/json");
    res.json({ error: "Invalid data" });
  }
});

module.exports = router;
