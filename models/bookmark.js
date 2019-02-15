const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  _post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  }
});

const model = mongoose.model("Bookmark", bookmarkSchema);

module.exports = model;
