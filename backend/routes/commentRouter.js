const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// router.get("/filter", commentsController.getFilteredPost);
// router.get("/:commentId", commentsController.getPost);
router.get("/", commentController.getAllComment);
router.post("/create", commentController.addComment);
router.post("/update/:commentId", commentController.updateComment);
router.delete("/delete/:commentId", commentController.deleteComment);

module.exports = router;
