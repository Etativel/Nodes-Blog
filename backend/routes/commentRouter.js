const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("./auth.js");
const { isCommentOwner } = require("../middlewares/isCommentOwner.js");

router.get("/", authenticateToken, commentController.getAllComment);
router.get(
  "/:commentId",
  authenticateToken,
  commentController.getSpecificComment
);
router.post("/create", authenticateToken, commentController.addComment);
router.post(
  "/reaction/toggle",
  authenticateToken,
  commentController.toggleReaction
);
router.patch(
  "/update/:commentId",
  authenticateToken,
  isCommentOwner,
  commentController.updateComment
);
router.delete(
  "/delete/:commentId",
  authenticateToken,
  isCommentOwner,
  commentController.deleteComment
);
router.post(
  "/report/:commentId",
  authenticateToken,
  commentController.reportComment
);

module.exports = router;
