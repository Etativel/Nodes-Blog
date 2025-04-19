const express = require("express");
const router = express.Router();
const moderationController = require("../../controllers/AdminPanelController/postsPanelController");
const {
  authenticateToken,
  isAdmin,
  isSuperAdmin,
} = require("../../routes/adminAuth");

router.get(
  "/all-posts",
  authenticateToken,
  isAdmin,
  // isSuperAdmin,
  moderationController.getAllPosts
);

router.post(
  "/update-status/:postId",
  authenticateToken,
  isAdmin,
  isSuperAdmin,
  moderationController.updatePostStatus
);

module.exports = router;
