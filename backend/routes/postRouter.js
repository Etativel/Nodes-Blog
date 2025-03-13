const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const passport = require("passport");
const upload = require("../config/multerConfig");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

router.get("/filter", postController.getFilteredPost);
router.get("/:postId", postController.getPost);
router.get("/", postController.getAllPost);
router.post("/create", upload.single("thumbnail"), postController.addPost);
router.put("/update/:postId", postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
