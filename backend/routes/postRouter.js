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
router.get("/", postController.getAllPost);
router.post("/create", upload.single("thumbnail"), postController.addPost);
router.post("/:postId/like", postController.toggleLike);
router.post("/:postId/bookmark", postController.toggleBookmark);
router.put("/update/:postId", postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
