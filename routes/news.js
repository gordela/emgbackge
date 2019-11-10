const News = require("../models/News");
const router = require("express").Router();
const { newsValidation } = require("../validation");
const verify = require("../routes/verifyToken");
const validateObjectId = require("../validateObjectId");
const admin = require("./admin");

router.get("/", (req, res) => {
  News.find((err, news) => res.send(news));
});

router.post("/", [verify, admin], async (req, res) => {
  const { error } = newsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const news = new News({
    publishDate: Date.now(),
    title: req.body.title,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    shortImage: req.body.shortImage,
    longImage: req.body.longImage,
    fbLink: req.body.fbLink,
    twLink: req.body.twLink
  });

  await news.save();

  res.send(news);
});

router.put("/:id", [validateObjectId, verify, admin], async (req, res) => {
  const { error } = newsValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const news = await News.findByIdAndRemove(req.params.id);

  const newNews = new News({
    publishDate: Date.now(),
    title: req.body.title,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    shortImage: req.body.shortImage,
    longImage: req.body.longImage,
    fbLink: req.body.fbLink,
    twLink: req.body.twLink
  });

  await newNews.save();

  res.send(newNews);
});

router.get("/:id", async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news)
    return res.status(404).send("The news with the given ID was not found.");

  res.send(news);
});

router.delete("/:id", [validateObjectId, verify, admin], async (req, res) => {
  try {
    const news = await News.findByIdAndRemove(req.params.id);
    res.send(news);
  } catch (error) {
    if (error)
      return res.status(404).send("The news with the given ID was not found.");
  }
});

module.exports = router;
