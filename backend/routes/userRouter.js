const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");
const { authenticateToken } = require("./auth.js");
const { authorizeUser } = require("../middlewares/authorizeUser.js");
const createLimiter = require("../utils/limiter.js");

const userLimiter = createLimiter({ windowMs: 5 * 60 * 1000, max: 5 });

router.post("/check-username", userLimiter, userController.getUserByUsername);
router.post("/check-email", userLimiter, userController.getUserByEmail);
router.post("/create", userLimiter, userController.createUser);
router.post(
  "/toggle-theme/:userId",
  authenticateToken,
  userController.toggleTheme
);

// Routes without rate limiter (just token/auth middlewares)
router.get(
  "/user-by-username/:username",
  authenticateToken,
  userController.getProfileByUsername
);
router.get("/:userId", authenticateToken, userController.getSpecificUser);
router.get("/", authenticateToken, userController.getAllUser);

router.delete("/delete/:userId", authenticateToken, userController.deleteUser);

router.patch(
  "/update/:userId",
  authorizeUser,
  authenticateToken,
  userController.updateUser
);
router.patch(
  "/update-field/:userId",
  authenticateToken,
  userController.updateUserField
);
router.patch(
  "/profile/update",
  authenticateToken,
  upload.single("profilePicture"),
  userController.updateProfile
);
router.patch("/follow", authenticateToken, userController.followUser);
router.patch("/unfollow", authenticateToken, userController.unFollowUser);

router.get("/get-theme/:userId", authenticateToken, userController.getTheme);

module.exports = router;
