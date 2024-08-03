const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const getResumeText = require("./utils/gpt");
const cors = require("cors");

app.listen(3000, () => {
  console.log("server started");
});

app.use(cors());
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
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const path = `./uploads/${req.file.originalname}`;
    const text = await getResumeText(path);

    // Assuming getResumeText function returns a promise resolving to text
    res.send(text);

    // Clean up: delete the uploaded file after processing
    fs.unlinkSync(path);
  } catch (err) {
    console.error("Error handling upload:", err);
    res.status(500).json({ error: "Error uploading or processing file" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "UP" });
});
