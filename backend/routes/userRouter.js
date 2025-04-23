const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");

const authenticateEither = require("../middlewares/authEither.js");
const { authorizeUser } = require("../middlewares/authorizeUser.js");
const createLimiter = require("../utils/limiter.js");

const userLimiter = createLimiter({ windowMs: 5 * 60 * 1000, max: 5 });

router.post("/check-username", userLimiter, userController.getUserByUsername);
router.post("/check-email", userLimiter, userController.getUserByEmail);
router.post("/create", userLimiter, userController.createUser);
router.post(
  "/toggle-theme/:userId",
  authenticateEither,
  userController.toggleTheme
);

// Routes without rate limiter (just token/auth middlewares)
router.get(
  "/user-by-username/:username",
  authenticateEither,
  userController.getProfileByUsername
);
router.get("/:userId", authenticateEither, userController.getSpecificUser);
router.get("/", authenticateEither, userController.getAllUser);

router.delete("/delete/:userId", authenticateEither, userController.deleteUser);

router.patch(
  "/update/:userId",
  authorizeUser,
  authenticateEither,
  userController.updateUser
);
router.patch(
  "/update-field/:userId",
  authenticateEither,
  userController.updateUserField
);
router.patch(
  "/profile/update",
  authenticateEither,
  upload.single("profilePicture"),
  userController.updateProfile
);
router.patch("/follow", authenticateEither, userController.followUser);
router.patch("/unfollow", authenticateEither, userController.unFollowUser);

router.get("/get-theme/:userId", authenticateEither, userController.getTheme);

module.exports = router;
