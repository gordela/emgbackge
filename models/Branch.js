var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const branchSchema = new Schema({
  text_one: String,
  text_two: String
});
module.exports = mongoose.model("Branch", branchSchema);
