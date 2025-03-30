const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");
router.post("/check-username", userController.getUserByUsername);
router.post("/check-email", userController.getUserByEmail);
router.get("/:userId", userController.getSpecificUser);
router.get("/", userController.getAllUser);
router.post("/create", userController.createUser);
router.delete("/delete/:userId", userController.deleteUser);
router.put("/update/:userId", userController.updateUser);
router.patch(
  "/profile/update",
  upload.single("profilePicture"),
  userController.updateProfile
);
module.exports = router;
