const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  bag: {
    type: Object,
    default: {}
  },
  address: {
    type: Object,
    default: {}
  },
  isAdmin: Boolean,
  default: false
});
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      bag: this.bag,
      address: this.address
    },
    process.env.TOKEN_SECRET
  );
  return token;
};
module.exports = mongoose.model("User", userSchema);
