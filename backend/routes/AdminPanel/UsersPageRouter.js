const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/AdminPanelController/usersPanelController");
const {
  authenticateToken,
  isAdmin,
  isSuperAdmin,
} = require("../../routes/adminAuth");

router.get(
  "/all-users",
  authenticateToken,
  isAdmin,
  usersController.getAllUsers
);

router.put(
  "/update-user/:userId",
  authenticateToken,
  isAdmin,
  isSuperAdmin,
  usersController.updateUser
);

module.exports = router;
