var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: String,
  shortDesc: String,
  longDesc: String,
  shortImage: String,
  longImage: String,
  fbLink: String,
  twLink: String,
  publishDate: Date
});
module.exports = mongoose.model("News", newsSchema);
