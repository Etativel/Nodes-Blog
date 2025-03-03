const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

// GET POST
async function getAllComment(req, res) {
  try {
    const comments = await prisma.comment.findMany();
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// async function getPost(req, res) {
//   const { commentId } = req.params;
//   try {
//     const comment = await prisma.comment.findUnique({
//       where: {
//         id: commentId,
//       },
//     });
//     if (!comment) {
//       return res.status(404).json({ error: "Comment not found" });
//     }
//     res.json({ comment });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async function getFilteredPost(req, res) {
//   const { content, title, published, author, createdAt, mode } = req.query;

//   try {
//     let filterConditions = {};

//     if (mode === "exact") {
//       if (title) {
//         filterConditions.title = { equals: title, mode: "insensitive" };
//       }
//       if (content) {
//         filterConditions.content = { equals: content, mode: "insensitive" };
//       }
//       if (author) {
//         filterConditions.author = { equals: author, mode: "insensitive" };
//       }
//       if (published) {
//         filterConditions.published = published === "true"; // boolean check
//       }
//       if (createdAt) {
//         filterConditions.createdAt = new Date(createdAt);
//       }
//     } else {
//       // Contains match: Return all posts that contain specific words
//       if (title) {
//         filterConditions.title = { contains: title, mode: "insensitive" };
//       }
//       if (content) {
//         filterConditions.content = { contains: content, mode: "insensitive" };
//       }
//       if (author) {
//         filterConditions.author = { contains: author, mode: "insensitive" };
//       }
//       if (published) {
//         filterConditions.published = published === "true";
//       }
//       if (createdAt) {
//         filterConditions.createdAt = { gte: new Date(createdAt) };
//       }
//     }

//     const posts = await prisma.post.findMany({
//       where: filterConditions,
//     });
//     console.log(filterConditions);
//     res.json({ posts });
//     // res.end();
//   } catch (error) {
//     console.error("Error fetching filtered posts:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// ADD POST

async function addComment(req, res) {
  const { content, postId, authorId } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        postId,
        content,
        authorId,
      },
    });
    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// UPDATE POST

async function updateComment(req, res) {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
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
    res.json({ comment: deletedComment });
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllComment,
  addComment,
  updateComment,
  deleteComment,
};
