const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

// GET COMMENT
async function getAllComment(req, res) {
  try {
    const comments = await prisma.comment.findMany();
    return res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ADD COMMENT

async function addComment(req, res) {
  const { content, postId, authorId, parentId } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        postId,
        content,
        authorId,
        parentId,
      },
    });
    return res.status(201).json({ comment: newComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// UPDATE COMMENT

async function updateComment(req, res) {
  const { content, commentId } = req.body;
  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
    return res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}

// DELETE COMMENT

async function deleteComment(req, res) {
  const { commentId } = req.params;
  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return res.json({ comment: deletedComment });
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Reaction
async function toggleReaction(req, res) {
  const { commentId, userId, reaction } = req.body;

  if (!["LIKE", "DISLIKE"].includes(reaction)) {
    return res.status(400).json({ error: "Invalid reaction type" });
  }

  try {
    const existing = await prisma.commentReaction.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    if (existing) {
      if (existing.reaction === reaction) {
        // remove reaction if same type clicked
        await prisma.commentReaction.delete({
          where: { commentId_userId: { commentId, userId } },
        });
      } else {
        // update to new reaction type
        await prisma.commentReaction.update({
          where: { commentId_userId: { commentId, userId } },
          data: { reaction },
        });
      }
    } else {
      await prisma.commentReaction.create({
        data: { commentId, userId, reaction },
      });
    }

    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        reactions: true,
        author: true,
        replies: true,
      },
    });

    return res.json({
      message: "Reaction updated",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// REPORT COMMENT
async function reportComment(req, res) {
  const { commentId } = req.params;
  const { reporterId, type, message } = req.body;
  const trimmedMessage = message?.trim() || "";

  try {
    const report = await prisma.commentReport.upsert({
      where: {
        commentId_reporterId: { commentId, reporterId },
      },
      create: {
        commentId,
        reporterId,
        type,
        message: trimmedMessage,
      },
      update: {
        type,
        message: trimmedMessage,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      report,
    });
  } catch (err) {
    console.error("Error reporting post:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSpecificComment(req, res) {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        reports: true,
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

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.json({ comment });
  } catch (error) {
    console.error("Error fetching comment", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllComment,
  addComment,
  updateComment,
  deleteComment,
  toggleReaction,
  reportComment,
  getSpecificComment,
};
