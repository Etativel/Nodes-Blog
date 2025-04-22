const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/AdminPanelController/dashboardPanelController");
const {
  authenticateToken,
  isAdmin,
  isSuperAdmin,
} = require("../../routes/adminAuth");
// all stats combined in a single request
router.get("/all-stats", statsController.getAllStats);

// individual statistics endpoints
router.get("/summary", authenticateToken, statsController.getSummaryStats);
router.get("/reports", authenticateToken, statsController.getReportStats);
router.get(
  "/post-status",
  authenticateToken,
  statsController.getPostStatusStats
);
router.get(
  "/recent-reports",
  authenticateToken,
  statsController.getRecentReports
);

// user-specific statistics
router.get("/user/:userId", authenticateToken, statsController.getUserStats);

module.exports = router;
