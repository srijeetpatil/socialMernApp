var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  caption: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
