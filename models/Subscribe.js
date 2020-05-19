var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
  email: String,
});
module.exports = mongoose.model("Subscribe", subscribeSchema);
