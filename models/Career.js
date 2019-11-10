var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const careerSchema = new Schema({
  title: String,
  published: Date,
  endDate: Date,
  description: String
});
module.exports = mongoose.model("Career", careerSchema);
