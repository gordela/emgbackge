var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
  name: String,
  logo: String
});
module.exports = mongoose.model("Partner", partnerSchema);
