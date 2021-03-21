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
        if (result.password === password) {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          let obj = {
            token: result.token,
          };
          res.json(obj);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          res.json({ error: "Incorrect password" });
        }
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
  let username = data.username;
  if (email && password && username) {
    User.findOne({ email: email }, (err, result) => {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Invalid email id" });
      } else if (err) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Unexpected error" });
        return next(err);
      } else if (result) {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.json({ error: "Account with this email already exists" });
      } else {
        User.findOne({ username: username }, (err, result) => {
          if (username.length > 50) {
            res.statusCode = 400;
            res.setHeader("Content-type", "application/json");
            res.json({ error: "Username too long" });
          }
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-type", "application/json");
            res.json({ error: "Unexpected error" });
          } else if (result) {
            res.statusCode = 400;
            res.setHeader("Content-type", "application/json");
            res.json({ error: "Account with this username already exists" });
          } else {
            var hash = Crypto.AES.encrypt(
              email + password + username,
              "qweaSASdfEwmmavOppkfa"
            ).toString();
            let newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              password: password,
              username: username,
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
      }
    });
  } else {
    res.statusCode = 400;
    res.setHeader("Content-type", "application/json");
    res.json({ error: "Invalid data" });
  }
});

module.exports = router;
