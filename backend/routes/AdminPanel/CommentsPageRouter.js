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
  isAdmin,
  commentsController.getAllComments
);
router.delete(
  "/delete-comment/:commentId",
  authenticateToken,
  isAdmin,
  commentsController.deleteComment
);

module.exports = router;
