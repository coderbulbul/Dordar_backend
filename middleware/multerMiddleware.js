// Import dependencies
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const body_parser = require("body-parser");

// Configure express app
const app = express();
app.use(express.json());
app.use(body_parser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Disk storage
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer filter
const multerFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  else {
    cb("Error: Please upload image only");
  }
};

// Upload image
const uploadStorage = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10000000,
  },
});

module.exports = { uploadStorage };
