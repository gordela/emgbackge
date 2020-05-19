const Subscribe = require("../models/Subscribe");
const router = require("express").Router();
const { subscribeValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Subscribe.find((err, partners) => res.send(partners));
});

router.post("/", async (req, res) => {
  const { error } = subscribeValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const subscribe = new Subscribe({
    email: req.body.email,
  });

  await subscribe.save();

  res.send(subscribe);
});

module.exports = router;
