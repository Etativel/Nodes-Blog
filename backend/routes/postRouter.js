const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authenticateEither = require("../middlewares/authEither.js");

const { isOwner } = require("../middlewares/isOwner.js");
const upload = require("../config/multerConfig");
const { isAdmin } = require("./adminAuth.js");
const createLimiter = require("../utils/limiter.js");

const postActionLimiter = createLimiter({ windowMs: 10 * 60 * 1000, max: 20 });
const postCreateLimiter = createLimiter({ windowMs: 30 * 60 * 1000, max: 5 });

router.get(
  "/featured-n-trending-post",
  authenticateEither,
  postController.getFeaturedPost
);
router.get("/by/:username", authenticateEither, postController.getUserPosts);
router.get("/filter", authenticateEither, postController.getFilteredPost);
router.get("/:postId", authenticateEither, postController.getPost);
router.get("/", authenticateEither, postController.getAllPost);

router.post(
  "/create",
  postCreateLimiter,
  upload.single("thumbnail"),
  postController.addPost
);
router.post(
  "/:postId/like",
  authenticateEither,
  postActionLimiter,
  postController.toggleLike
);
router.post(
  "/:postId/bookmark",
  authenticateEither,
  postActionLimiter,
  postController.toggleBookmark
);
router.post(
  "/report/:postId",
  authenticateEither,
  postActionLimiter,
  postController.reportPost
);
router.post(
  "/feature-post/:postId",
  authenticateEither,
  isAdmin,
  postActionLimiter,
  postController.toggleFeatured
);

router.put(
  "/update/:postId",
  authenticateEither,
  isOwner,
  upload.single("thumbnail"),
  postController.simpleUpdatePost
);
router.put(
  "/publish/:postId",
  authenticateEither,
  isOwner,
  postController.togglePublish
);
router.delete(
  "/delete/:postId",
  authenticateEither,
  isOwner,
  postController.deletePost
);

module.exports = router;
