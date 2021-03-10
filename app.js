var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var multer = require("multer");
var upload = multer();
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var postRouter = require("./routes/post");
var authRouter = require("./routes/auth");

var app = express();

app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/build")));
app.use(upload.array());

mongoose.connect("mongodb://localhost:27017/test", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Test");
});
mongoose.connection.on("error", (error) => {
  console.log(error);
});

app.use("/api/", indexRouter);
app.use("/api/post/", postRouter);
app.use("/api/auth/", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
