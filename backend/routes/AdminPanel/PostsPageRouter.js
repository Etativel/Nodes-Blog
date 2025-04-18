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
  moderationController.getAllPosts
);

module.exports = router;
