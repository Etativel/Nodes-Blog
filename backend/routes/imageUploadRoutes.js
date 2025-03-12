const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ url: req.file.path });
});

module.exports = router;
