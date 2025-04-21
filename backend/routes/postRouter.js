const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const passport = require("passport");
const upload = require("../config/multerConfig");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

router.get("/by/:username", postController.getUserPosts);
router.get("/filter", postController.getFilteredPost);
router.get("/:postId", postController.getPost);
// router.get("/", postController.getLimitPost);
router.get("/", postController.getAllPost);
router.post("/create", upload.single("thumbnail"), postController.addPost);
router.post("/:postId/like", postController.toggleLike);
router.post("/:postId/bookmark", postController.toggleBookmark);
// router.put("/update/:postId", postController.updatePost);
router.put(
  "/update/:postId",
  upload.single("thumbnail"),
  postController.simpleUpdatePost
);
router.put("/publish/:postId", postController.togglePublish);
router.delete("/delete/:postId", postController.deletePost);
router.post("/report/:postId", postController.reportPost);
router.get("/featured-trending", postController.getFeaturedPost);
router.post("/feature-post/:postId", postController.toggleFeatured);
module.exports = router;
