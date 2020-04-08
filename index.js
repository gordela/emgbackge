const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const branchRoute = require("./routes/branch");
const careerRoute = require("./routes/career");
const categoryRoute = require("./routes/category");
const partnerRoute = require("./routes/partner");
const searchRoute = require("./routes/search");
const employeeRoute = require("./routes/employee");
const newsRoute = require("./routes/news");
const projectRoute = require("./routes/project");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");

const app = express();
app.set("view engine", "ejs");
//Public Folder
app.use(express.static("./public"));

//File uPload
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Init upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

//Check file Type
function checkFileType(file, cb) {
  //Allowed Extensions
  const filetypes = /jpeg|jpg|png|gif|woff|woff2/;
  //Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("connected to db")
);
mongoose.set("useFindAndModify", false);

app.use(express.json());
app.use(cors());

//Route middlewares
app.use("/api/user", authRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/branch", branchRoute);
app.use("/api/career", careerRoute);
app.use("/api/category", categoryRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/news", newsRoute);
app.use("/api/project", projectRoute);
app.use("/api/search", searchRoute);
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file == undefined) {
        console.log(req);
        res.render("index", { msg: "Error: no file selected!" });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
  console.log("HTTP Server running on port " + process.env.PORT);
});
