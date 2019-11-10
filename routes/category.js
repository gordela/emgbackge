const Category = require("../models/Category");
const router = require("express").Router();
const verify = require("./verifyToken");
const { categoryValidation } = require("../validation");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.post("/", verify, async (req, res) => {
  const { error } = categoryValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category({ name: req.body.name, image: req.body.image });
  try {
    const savedCategory = await category.save();
    res.send(savedCategory);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = categoryValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, image: req.body.image },
    {
      new: true
    }
  );

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id).select("-__v");

  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});
module.exports = router;
