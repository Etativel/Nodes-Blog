const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/AdminPanelController/commentsPanelController");
const {
  authenticateToken,
  isAdmin,
  isSuperAdmin,
} = require("../../routes/adminAuth");

router.get(
  "/all-comments",
  authenticateToken,
  commentsController.getAllComments
);
router.delete(
  "/delete-comment/:commentId",
  authenticateToken,
  commentsController.deleteComment
);

module.exports = router;
