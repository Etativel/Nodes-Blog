// isOwner.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function isOwner(req, res, next) {
  const authenticatedUserId = req.user.id;
  const postId = req.params.postId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== authenticatedUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this post" });
    }

    next();
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { isOwner };
