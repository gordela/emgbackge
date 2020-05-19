const Partner = require("../models/Partner");
const router = require("express").Router();
const { partnerValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Partner.find((err, partners) => res.send(partners));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = partnerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const partner = new Partner({
    name: req.body.name,
    logo: req.body.logo,
    description: req.body.description,
    link: req.body.link,
  });

  await partner.save();

  res.send(partner);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = partnerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const partner = await Partner.findByIdAndRemove(req.params.id);

  const newPartner = new Partner({
    logo: req.body.logo,
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
  });

  await newPartner.save();

  res.send(newPartner);
});

router.get("/:id", async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner)
    return res.status(404).send("The partner with the given ID was not found.");

  res.send(partner);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const partner = await Partner.findByIdAndRemove(req.params.id);
    res.send(partner);
  } catch (error) {
    if (error)
      return res
        .status(404)
        .send("The partner with the given ID was not found.");
  }
});

module.exports = router;
