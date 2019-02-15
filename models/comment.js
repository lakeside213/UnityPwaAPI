const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  createdAt: Date,
  description: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  likes: [{ type: Schema.ObjectId, ref: "User" }],
  _responseUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const model = mongoose.model("Comment", commentSchema);

module.exports = model;
