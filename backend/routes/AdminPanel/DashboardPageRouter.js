const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/AdminPanelController/dashboardPanelController");

// all stats combined in a single request
router.get("/all-stats", statsController.getAllStats);

// individual statistics endpoints
router.get("/summary", statsController.getSummaryStats);
router.get("/reports", statsController.getReportStats);
router.get("/post-status", statsController.getPostStatusStats);
router.get("/recent-reports", statsController.getRecentReports);

// user-specific statistics
router.get("/user/:userId", statsController.getUserStats);

module.exports = router;
