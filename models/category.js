const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  color: String
});

const model = mongoose.model("category", categorySchema);

module.exports = model;
