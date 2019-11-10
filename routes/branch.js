const Branch = require("../models/Branch");
const router = require("express").Router();
const { branchValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Branch.find((err, branches) => res.send(branches));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = branchValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const branch = new Branch({
    text_one: req.body.text_one,
    text_two: req.body.text_two
  });

  await branch.save();

  res.send(branch);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = branchValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const branch = await Branch.findByIdAndRemove(req.params.id);

  const newBranch = new Branch({
    text_one: req.body.text_one,
    text_two: req.body.text_two
  });

  await newBranch.save();

  res.send(newBranch);
});

router.get("/:id", async (req, res) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch)
    return res.status(404).send("The branch with the given ID was not found.");

  res.send(branch);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const branch = await Branch.findByIdAndRemove(req.params.id);
    res.send(branch);
  } catch (error) {
    if (error)
      return res.status(404).send("The branch with the given ID was not found.");
  }
});

module.exports = router;
