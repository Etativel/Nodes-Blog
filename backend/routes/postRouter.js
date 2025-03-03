const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/filter", postController.getFilteredPost);
router.get("/:postId", postController.getPost);
router.get("/", postController.getAllPost);
router.post("/create", postController.addPost);
router.put("/update/:postId", postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
