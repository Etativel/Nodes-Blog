const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// router.get("/filter", commentsController.getFilteredPost);
// router.get("/:commentId", commentsController.getPost);
router.get("/", commentController.getAllComment);
router.get("/:commentId", commentController.getSpecificComment);
router.post("/create", commentController.addComment);
router.post("/reaction/toggle", commentController.toggleReaction);
router.patch("/update/:commentId", commentController.updateComment);
router.delete("/delete/:commentId", commentController.deleteComment);
router.post("/report/:commentId", commentController.reportComment);

module.exports = router;
