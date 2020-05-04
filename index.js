const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const branchRoute = require("./routes/branch");
const crypto = require("crypto");
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
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

const app = express();
app.set("view engine", "ejs");
//Public Folder
// app.use(express.static("./public"));
// Middleware
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
//File uPload
// const storage = multer.diskStorage({
//   destination: "./public/uploads",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

//Init upload
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("myImage");

//Check file Type
// function checkFileType(file, cb) {
//   //Allowed Extensions
//   const filetypes = /jpeg|jpg|png|gif|woff|woff2/;
//   //Check extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   //Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images only!");
//   }
// }
dotenv.config();

const mongoURI = process.env.DB_CONNECT;
const conn = mongoose.createConnection(mongoURI);
//Connect to DB

let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

//Create Storage Engine
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form
app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});
// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/");
});

// @route GET /files
// @desc  Display all files in JSON
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete("/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect("/");
  });
});

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

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
  console.log("HTTP Server running on port " + process.env.PORT);
});
