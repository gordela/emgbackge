const Project = require("../models/Project");
const Category = require("../models/Category");
const router = require("express").Router();
const { projectValidation, categoryValidation } = require("../validation");
const verify = require("./verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  Project.find((err, projects) => res.send(projects));
});

router.get("/category/:id", async (req, res) => {
  console.log(req.params.id);
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(400).send("Invalid category.");
  const categoryFiltered = {
    _id: String(category._id),
    name: category.name
  };
  console.log(categoryFiltered);

  Project.find({
    category: categoryFiltered
  }).exec(function(err, user) {
    if (err) console.log("Error: " + JSON.stringify(err));
    else if (user) res.send(JSON.stringify(user));
  });
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = projectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid category.");

  const project = new Project({
    publishDate: Date.now(),
    title: req.body.title,
    category: { _id: category._id, name: category.name },
    client: req.body.client,
    duration: req.body.duration,
    fbLink: req.body.fbLink,
    twLink: req.body.twLink,
    longDesc: req.body.longDesc,
    shortDesc: req.body.shortDesc,
    longImage: req.body.longImage,
    shortImage: req.body.shortImage
  });
  await project.save();

  res.send(project);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = projectValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid category.");

  const project = await Project.findByIdAndRemove(req.params.id);

  const newProject = new Project({
    publishDate: Date.now(),
    title: req.body.title,
    category: { _id: category._id, name: category.name },
    client: req.body.client,
    duration: req.body.duration,
    fbLink: req.body.fbLink,
    twLink: req.body.twLink,
    longDesc: req.body.longDesc,
    shortDesc: req.body.shortDesc,
    longImage: req.body.longImage,
    shortImage: req.body.shortImage
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
