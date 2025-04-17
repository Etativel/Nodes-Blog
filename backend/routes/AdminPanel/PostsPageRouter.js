const express = require("express");
const router = express.Router();
const moderationController = require("../../controllers/AdminPanelController/postsPanelController");
const { authenticateToken, isAdmin } = require("../../routes/adminAuth");

router.get(
  "/all-posts",
  // authenticateToken,
  // isAdmin,
  moderationController.getAllPosts
);

router.get(
  "/reported",
  // authenticateToken,
  // isAdmin,
  moderationController.getReportedPosts
);

router.get(
  "/reported/:postId",
  authenticateToken,
  isAdmin,
  moderationController.getReportedPostDetails
);

router.get(
  "/filter",
  authenticateToken,
  isAdmin,
  moderationController.filterReportedPosts
);

router.post(
  "/moderate/:postId",
  authenticateToken,
  isAdmin,
  moderationController.moderatePost
);

router.get(
  "/analytics",
  authenticateToken,
  isAdmin,
  moderationController.getReportingAnalytics
);

router.get(
  "/high-priority",
  authenticateToken,
  isAdmin,
  moderationController.getHighPriorityReports
);

module.exports = router;
