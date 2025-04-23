const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("./auth.js");
const { isOwner } = require("../middlewares/isOwner.js");
const upload = require("../config/multerConfig");
const { isAdmin } = require("./adminAuth.js");
const createLimiter = require("../utils/limiter.js");

const postActionLimiter = createLimiter({ windowMs: 10 * 60 * 1000, max: 20 });
const postCreateLimiter = createLimiter({ windowMs: 30 * 60 * 1000, max: 5 });

router.get(
  "/featured-n-trending-post",
  authenticateToken,
  postController.getFeaturedPost
);
router.get("/by/:username", authenticateToken, postController.getUserPosts);
router.get("/filter", authenticateToken, postController.getFilteredPost);
router.get("/:postId", authenticateToken, postController.getPost);
router.get("/", authenticateToken, postController.getAllPost);

router.post(
  "/create",
  postCreateLimiter,
  upload.single("thumbnail"),
  postController.addPost
);
router.post(
  "/:postId/like",
  authenticateToken,
  postActionLimiter,
  postController.toggleLike
);
router.post(
  "/:postId/bookmark",
  authenticateToken,
  postActionLimiter,
  postController.toggleBookmark
);
router.post(
  "/report/:postId",
  authenticateToken,
  postActionLimiter,
  postController.reportPost
);
router.post(
  "/feature-post/:postId",
  authenticateToken,
  isAdmin,
  postActionLimiter,
  postController.toggleFeatured
);

router.put(
  "/update/:postId",
  authenticateToken,
  isOwner,
  upload.single("thumbnail"),
  postController.simpleUpdatePost
);
router.put(
  "/publish/:postId",
  authenticateToken,
  isOwner,
  postController.togglePublish
);
router.delete(
  "/delete/:postId",
  authenticateToken,
  isOwner,
  postController.deletePost
);

module.exports = router;
