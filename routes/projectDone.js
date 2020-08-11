const Project = require("../models/ProjectDone");
const router = require("express").Router();
const { projectValidation } = require("../validation");
const verify = require("./verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Project.find((err, project) => res.send(project));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = projectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = new Project({
    publishDate: Date.now(),
    title: req.body.title,
    client: req.body.client,
    duration: req.body.duration,
    longDesc: req.body.longDesc,
    shortDesc: req.body.shortDesc,
    shortImage: req.body.shortImage,
    longImage: req.body.longImage,
    location: req.body.location,
    serviceType: req.body.serviceType,
    contractType: req.body.contractType,
    customer: req.body.customer,
    generalContractor: req.body.generalContractor,
    financing: req.body.financing,
    price: req.body.price,
    partner: req.body.partner,
  });

  await project.save();

  res.send(project);
});
router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = projectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.findByIdAndRemove(req.params.id);

  const newProject = new Project({
    publishDate: Date.now(),
    title: req.body.title,
    client: req.body.client,
    duration: req.body.duration,
    longDesc: req.body.longDesc,
    shortDesc: req.body.shortDesc,
    shortImage: req.body.shortImage,
    longImage: req.body.longImage,
    location: req.body.location,
    serviceType: req.body.serviceType,
    contractType: req.body.contractType,
    customer: req.body.customer,
    generalContractor: req.body.generalContractor,
    financing: req.body.financing,
    price: req.body.price,
    partner: req.body.partner,
  });

  await newProject.save();

  res.send(newProject);
});

router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project)
    return res.status(404).send("The project with the given ID was not found.");

  res.send(project);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const project = await Project.findByIdAndRemove(req.params.id);
    res.send(project);
  } catch (error) {
    if (error)
      return res
        .status(404)
        .send("The project with the given ID was not found.");
  }
});

module.exports = router;
