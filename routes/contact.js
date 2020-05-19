const Contact = require("../models/Contact");
const router = require("express").Router();
const { contactValidation } = require("../validation");

router.get("/", (req, res) => {
  Contact.find((err, letters) => res.send(letters));
});

router.post("/", async (req, res) => {
  const { error } = contactValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const contact = new Contact({
    letter: req.body.letter,
    name: req.body.name,
    email: req.body.email,
  });

  await contact.save();

  res.send(contact);
});

module.exports = router;
