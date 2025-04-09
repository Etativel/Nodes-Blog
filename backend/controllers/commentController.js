const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

// GET POST
async function getAllComment(req, res) {
  try {
    const comments = await prisma.comment.findMany();
    return res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ADD POST

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

// UPDATE POST

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

// DELETE POST

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

async function toggleReaction(req, res) {
  const { commentId, userId, reaction } = req.body;

  try {
    const existing = await prisma.commentReaction.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    if (existing) {
      // Remove reaction if clicking the same one
      await prisma.commentReaction.delete({
        where: { commentId_userId: { commentId, userId } },
      });
    } else {
      // Create new reaction or replace existing one
      await prisma.commentReaction.upsert({
        where: { commentId_userId: { commentId, userId } },
        create: { commentId, userId, reaction },
        update: { reaction },
      });
    }

    // Get updated comment with reactions
    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        reactions: true,
        author: true,
        replies: true,
      },
    });

    return res.json({
      message: `Reaction updated`,
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllComment,
  addComment,
  updateComment,
  deleteComment,
  toggleReaction,
};
