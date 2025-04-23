const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("./auth.js");
const { isCommentOwner } = require("../middlewares/isCommentOwner.js");
const createLimiter = require("../utils/limiter.js");

const commentCreateLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
});
const commentActionLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
});

router.get("/", authenticateToken, commentController.getAllComment);
router.get(
  "/:commentId",
  authenticateToken,
  commentController.getSpecificComment
);

router.post(
  "/create",
  authenticateToken,
  commentCreateLimiter,
  commentController.addComment
);
router.post(
  "/reaction/toggle",
  authenticateToken,
  commentActionLimiter,
  commentController.toggleReaction
);
router.post(
  "/report/:commentId",
  authenticateToken,
  commentActionLimiter,
  commentController.reportComment
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

module.exports = router;
