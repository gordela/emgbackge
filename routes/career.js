const Career = require("../models/Career");
const router = require("express").Router();
const { careerValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Career.find((err, carriers) => res.send(carriers));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = careerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const career = new Career({
    published: Date.now(),
    title: req.body.title,
    endDate: req.body.endDate,
    description: req.body.description
  });

  await career.save();

  res.send(career);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = careerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  await Career.findByIdAndRemove(req.params.id);

  const newCareer = new Career({
    published: Date.now(),
    title: req.body.title,
    endDate: req.body.endDate,
    description: req.body.description
  });

  await newCareer.save();

  res.send(newCareer);
});

router.get("/:id", async (req, res) => {
  const career = await Career.findById(req.params.id);

  if (!career)
    return res.status(404).send("The career with the given ID was not found.");

  res.send(career);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const career = await Career.findByIdAndRemove(req.params.id);
    res.send(career);
  } catch (error) {
    if (error)
      return res
        .status(404)
        .send("The career with the given ID was not found.");
  }
});

module.exports = router;
