const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../config/cloudinaryConfig");

// GET POST
async function getUserPosts(req, res) {
  const { username } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user" });
    }
    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllPost(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: true,
      },
      omit: {
        content: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getPost(req, res) {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            userColor: true,
            fullName: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getFilteredPost(req, res) {
  const { content, title, published, author, createdAt, mode } = req.query;

  try {
    let filterConditions = {};

    if (mode === "exact") {
      if (title) {
        filterConditions.title = { equals: title, mode: "insensitive" };
      }
      if (content) {
        filterConditions.content = { equals: content, mode: "insensitive" };
      }
      if (author) {
        filterConditions.author = { equals: author, mode: "insensitive" };
      }
      if (published) {
        filterConditions.published = published === "true"; // boolean check
      }
      if (createdAt) {
        filterConditions.createdAt = new Date(createdAt);
      }
    } else {
      // Contains match: Return all posts that contain specific words
      if (title) {
        filterConditions.title = { contains: title, mode: "insensitive" };
      }
      if (content) {
        filterConditions.content = { contains: content, mode: "insensitive" };
      }
      if (author) {
        filterConditions.author = { contains: author, mode: "insensitive" };
      }
      if (published) {
        filterConditions.published = published === "true";
      }
      if (createdAt) {
        filterConditions.createdAt = { gte: new Date(createdAt) };
      }
    }

    const posts = await prisma.post.findMany({
      where: filterConditions,
    });
    console.log(filterConditions);
    return res.json({ posts });
    // res.end();
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// ADD POST

async function addPost(req, res) {
  const { content, title, published, authorId, excerpt } = req.body;
  let thumbnailUrl = null;

  try {
    if (req.file) {
      thumbnailUrl = req.file.path;
    }

    const newPost = await prisma.post.create({
      data: {
        id: uuidv4(),
        title,
        content,
        published: published === "true",
        authorId,
        excerpt,
        thumbnail: thumbnailUrl,
      },
    });
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// UPDATE POST

async function updatePost(req, res) {
  const { postId } = req.params;
  const { content, title, published, authorId } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        published,
        authorId,
        // thumbnail,
      },
    });
    return res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}

// DELETE POST

async function deletePost(req, res) {
  const { postId } = req.params;
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return res.json({ post: deletedPost });
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllPost,
  getPost,
  getFilteredPost,
  addPost,
  updatePost,
  deletePost,
  getUserPosts,
};
