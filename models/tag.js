const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: String,
  color: String
});

const model = mongoose.model("tag", tagSchema);

module.exports = model;
