const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // Import the cors package

const app = express();
app.use(cors());

const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/dropbox-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/plain",
    "image/jpeg",
    "image/png",
    "application/json",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type. Only ${allowedTypes} are allowed.`),
      false
    );
  }
};
const upload = multer({ storage, fileFilter });

// Upload API
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = new File({
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
  await file.save();
  res.send("File uploaded successfully");
});

// Get List of Files API
app.get("/files", async (req, res) => {
  const files = await File.find();
  res.json(files);
});

// Download API
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// Delete File API
app.delete("/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send("File not found");
    }
    const filePath = path.join(__dirname, "uploads", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const query = { filename: file.filename };
    await File.deleteOne(query);
    res.send("File deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting file");
  }
});

// View File API (inline viewing)
app.get("/view/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send("File not found");
    }
    const filePath = path.join(__dirname, "uploads", file.filename);
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", file.mimetype);
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    res.status(500).send("Error viewing file");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
