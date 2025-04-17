const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/AdminPanelController/commentsPanelController");

router.get("/all-comments", commentsController.getAllComments);

module.exports = router;
