const express = require("express");
const router = express.Router();
const controller = require("../controllers/postsController");

router.get("/", controller.getAllPosts);
router.get("/:postId", controller.getPost);
router.post("/create", controller.addPost);
router.post("/update/:postId", controller.updatePost);
router.delete("/delete/:postId", controller.deletePost);

module.exports = router;
