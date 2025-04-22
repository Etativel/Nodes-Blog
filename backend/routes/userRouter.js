const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");
const { authenticateToken } = require("./auth.js");
const { authorizeUser } = require("../middlewares/authorizeUser.js");
router.post(
  "/check-username",

  userController.getUserByUsername
);
router.post("/check-email", userController.getUserByEmail);
router.get(
  "/user-by-username/:username",
  authenticateToken,
  userController.getProfileByUsername
);
router.get("/:userId", authenticateToken, userController.getSpecificUser);
router.get("/", authenticateToken, userController.getAllUser);
router.post("/create", userController.createUser);
router.delete(
  "/delete/:userId",
  // authorizeUser,
  authenticateToken,
  userController.deleteUser
);
router.patch(
  "/update/:userId",
  authorizeUser,
  authenticateToken,
  userController.updateUser
);
router.patch(
  "/update-field/:userId",
  authenticateToken,
  // authorizeUser,
  userController.updateUserField
);
router.patch(
  "/profile/update",
  authenticateToken,
  // authorizeUser,
  upload.single("profilePicture"),
  userController.updateProfile
);
router.patch("/follow", authenticateToken, userController.followUser);
router.patch("/unfollow", authenticateToken, userController.unFollowUser);
router.post(
  "/toggle-theme/:userId",
  authenticateToken,
  // authorizeUser,
  userController.toggleTheme
);
router.get("/get-theme/:userId", authenticateToken, userController.getTheme);

module.exports = router;
