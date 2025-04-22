const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function isCommentOwner(req, res, next) {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this comment" });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}

module.exports = { isCommentOwner };
