var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: String,
  email: String,
  letter: String,
});
module.exports = mongoose.model("ContactSchema", contactSchema);
