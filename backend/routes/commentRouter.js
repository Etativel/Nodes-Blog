const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authenticateEither = require("../middlewares/authEither.js");

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

router.get("/", authenticateEither, commentController.getAllComment);
router.get(
  "/:commentId",
  authenticateEither,
  commentController.getSpecificComment
);

router.post(
  "/create",
  authenticateEither,
  commentCreateLimiter,
  commentController.addComment
);
router.post(
  "/reaction/toggle",
  authenticateEither,
  commentActionLimiter,
  commentController.toggleReaction
);
router.post(
  "/report/:commentId",
  authenticateEither,
  commentActionLimiter,
  commentController.reportComment
);

router.patch(
  "/update/:commentId",
  authenticateEither,
  isCommentOwner,
  commentController.updateComment
);
router.delete(
  "/delete/:commentId",
  authenticateEither,
  isCommentOwner,
  commentController.deleteComment
);

module.exports = router;
