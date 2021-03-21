var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  token: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

var User = mongoose.model("User", userSchema);

module.exports = User;
