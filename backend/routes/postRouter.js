const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("./auth.js");
const { isOwner } = require("../middlewares/isOwner.js");
const upload = require("../config/multerConfig");
const { isAdmin } = require("./adminAuth.js");

router.get(
  "/featured-n-trending-post",
  authenticateToken,
  postController.getFeaturedPost
);
router.get("/by/:username", authenticateToken, postController.getUserPosts);
router.get("/filter", authenticateToken, postController.getFilteredPost);
router.get("/:postId", authenticateToken, postController.getPost);
// router.get("/", postController.getLimitPost);
router.get("/", authenticateToken, postController.getAllPost);
router.post("/create", upload.single("thumbnail"), postController.addPost);
router.post("/:postId/like", authenticateToken, postController.toggleLike);
router.post(
  "/:postId/bookmark",
  authenticateToken,
  postController.toggleBookmark
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
router.post("/report/:postId", authenticateToken, postController.reportPost);

router.post(
  "/feature-post/:postId",
  authenticateToken,
  isAdmin,
  postController.toggleFeatured
);
module.exports = router;
