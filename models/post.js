const mongoose = require("mongoose");
const tagSchema = require("./tag");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  category: String,

  createdAt: Date,
  description: String,
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{ type: Schema.ObjectId, ref: "User" }]
  // tags: [tagSchema],

  //  dislikes: [user],
  //  stars: [user],
});

const model = mongoose.model("Post", postSchema);

module.exports = model;
