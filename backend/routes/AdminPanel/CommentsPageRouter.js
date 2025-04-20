const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/AdminPanelController/commentsPanelController");

router.get("/all-comments", commentsController.getAllComments);
router.delete("/delete-comment/:commentId", commentsController.deleteComment);

module.exports = router;
