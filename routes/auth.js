var express = require("express");
var router = express.Router();

var User = require("../models/users");

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
        require("crypto").randomBytes(48, function (err, buffer) {
          if (err) return next(err);
          var token = buffer.toString("hex");
          console.log(token);
        });
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json({ result });
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
        let newUser = new User({
          email: email,
          password: password,
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
