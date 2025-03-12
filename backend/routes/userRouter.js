const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getSpecificUser);
router.get("/", userController.getAllUser);
router.post("/create", userController.createUser);
router.delete("/delete/:userId", userController.deleteUser);
router.put("/update/:userId", userController.updateUser);

module.exports = router;
