var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectDoneSchema = new Schema({
  title: String,
  client: String,
  duration: String,
  longDesc: String,
  shortDesc: String,
  shortImage: String,
  longImage: String,
  location: String,
  serviceType: String,
  contractType: String,
  customer: String,
  generalContractor: String,
  financing: String,
  price: String,
  partner: String,
  publishDate: Date,
});
module.exports = mongoose.model("ProjectDone", projectDoneSchema);
