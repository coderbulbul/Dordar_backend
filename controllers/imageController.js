// Import dependencies
const express = require("express");
const multer = require("multer");

const uploadImage = () => {
  const UPLOADS_FOLDER = "./uploads";

  const storage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
  });

  //   prepare the final upload object
  var upload = multer({
    storage: storage,
  });
};

module.export = { uploadImage };
