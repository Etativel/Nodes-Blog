const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllComments(req, res) {
  try {
    // fetch all comments + relations
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reactions: {
          select: {
            id: true,
            userId: true,
            reaction: true,
            createdAt: true,
          },
        },
        reports: {
          select: {
            id: true,
            type: true,
            message: true,
            createdAt: true,
            reporter: {
              select: {
                username: true,
              },
            },
          },
        },
        post: {
          select: {
            title: true,
          },
        },
        author: {
          select: {
            username: true,
            role: true,
            profilePicture: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            postId: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
            parentId: true,
            author: {
              select: {
                username: true,
                role: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (comments.length === 0) {
      return res.status(404).json({ error: "No comments found" });
    }

    const commentsWithStatus = comments.map((comment) => ({
      ...comment,
      status: comment.reports.length > 0 ? "REPORTED" : "ACTIVE",
    }));

    return res.json({ comments: commentsWithStatus });
  } catch (error) {
    console.error("Error fetching comments", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteComment(req, res) {
  const { commentId } = req.params;

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return res.json({
      message: "Comment deleted successfully",
      comment: deletedComment,
    });
  } catch (error) {
    console.error("Error deleting comment", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllComments,
  deleteComment,
};
