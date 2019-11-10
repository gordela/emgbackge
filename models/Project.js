var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: String,
  client: String,
  duration: Number,
  fbLink: String,
  twLink: String,
  longDesc: String,
  shortDesc: String,
  shortImage: String,
  longImage: String,
  category: { _id: String, name: String }
});
module.exports = mongoose.model("Project", projectSchema);
