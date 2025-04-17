const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/AdminPanelController/usersPanelController");

router.get("/all-users", usersController.getAllUsers);

module.exports = router;
