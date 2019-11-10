const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const _ = require("lodash");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking user existence
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: false,
    address: {},
    bag: {}
  });
  const token = user.generateAuthToken();
  user.save();
  try {
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(
        _.pick(user, ["_id", "name", "email", "isAdmin", "bag", "password"])
      );
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking user existence

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesn't exist");
  //password check
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");
  // Create token
  const token = jwt.sign(
    _.pick(user, ["_id", "name", "email", "isAdmin", "bag", "password"]),
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).send(token);
});

module.exports = router;
