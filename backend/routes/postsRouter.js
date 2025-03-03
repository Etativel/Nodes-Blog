const express = require("express");
const router = express.Router();
const postController = require("../controllers/postsController");

router.get("/filter", postController.getFilteredPost);
router.get("/:postId", postController.getPost);
router.get("/", postController.getAllPosts);
router.post("/create", postController.addPost);
router.post("/update/:postId", postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
