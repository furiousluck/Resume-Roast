const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const getResumeText = require("./utils/gpt");
const cors = require("cors");



app.listen(3000, () => {
  console.log("server started");
});

app.use(cors(
    {
        origin: 'https://resume-roast.vercel.app/'
    }
)); // Enable CORS for all origins
app.use(express.static("uploads"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

app.post("/upload", upload, async (req, res) => {
  const path = `./uploads/${req.file.originalname}`;
  const text = await getResumeText(path);
  res.send(text);
  fs.unlinkSync(path);
});

app.get("/", (req, res) => {
  res.json("Hello World");
});
