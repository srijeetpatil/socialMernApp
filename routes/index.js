var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-feed/", (req, res, next) => {
  res.json({ answer: 42, hello: "world" });
});

module.exports = router;
