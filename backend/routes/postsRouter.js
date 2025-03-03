const express = require("express");
const router = express.Router();
const controller = require("../controllers/postsController");

router.get("/", controller.getAllPosts);
router.get("/:postId", controller.getPost);

module.exports = router;
