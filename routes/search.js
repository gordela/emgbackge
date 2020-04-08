const News = require("../models/News");
const Project = require("../models/Project");
const router = require("express").Router();

router.get("/", async (req, res) => {
  let news = News.find((err, news) => {
    return news;
  });
  let projects = Project.find((err, projects) => {
    return projects;
  });
  let allNews = await news.exec();
  let allProjects = await projects.exec();
  res.send(allNews.concat(allProjects));
});

module.exports = router;
