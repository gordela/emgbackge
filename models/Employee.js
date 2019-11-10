var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  picture: String,
  position: String,
  fullName: String,
  email: String
});
module.exports = mongoose.model("Employee", employeeSchema);
