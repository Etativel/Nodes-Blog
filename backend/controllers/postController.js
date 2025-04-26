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
        NOT: { status: "BLOCKED" },
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

    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Limit Post Fetch

async function getLimitPost(req, res) {
  const cursor = req.query.cursor;
  const limit = parseInt(req.query.limit) || 5;

  try {
    let posts;
    if (cursor) {
      posts = await prisma.post.findMany({
        cursor: { id: cursor },
        skip: 1,
        omit: {
          content: true,
        },
        include: {
          comments: true,
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } else {
      posts = await prisma.post.findMany({
        take: limit,
        omit: {
          content: true,
        },
        include: {
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      });
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
      where: {
        author: {
          suspensions: {
            none: {
              liftedAt: null,
            },
          },
        },
        NOT: { status: "BLOCKED" },
      },
      include: {
        comments: true,
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
      omit: {
        content: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const clean = posts.map((post) => ({
      ...post,
      likedCount: post._count.likedBy,
      _count: undefined,
    }));

    return res.json({ posts: clean });
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
        NOT: { status: "BLOCKED" },
        author: {
          suspensions: {
            none: {
              liftedAt: null,
            },
          },
        },
      },

      include: {
        reports: true,
        likedBy: true,
        bookmarkedBy: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            userColor: true,
            fullName: true,
            followers: true,
            following: true,
          },
        },

        comments: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            reactions: true,

            author: {
              select: {
                username: true,
                fullName: true,
                profilePicture: true,
                userColor: true,
                role: true,
              },
            },
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
  const { content, title, published, authorId, excerpt, status } = req.body;
  let thumbnailUrl = null;
  let thumbnailPublicId = null;

  try {
    if (req.file) {
      thumbnailUrl = req.file.path;
      thumbnailPublicId = req.file.filename;
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
        thumbnailPublicId,
        status,
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

async function simpleUpdatePost(req, res) {
  const { postId } = req.params;
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    let updateData = {
      ...req.body,
      published: req.body.published === "true",
    };
    console.log(updateData);
    if (req.file) {
      if (existingPost && existingPost.thumbnailPublicId) {
        const deleteResult = await cloudinary.uploader.destroy(
          existingPost.thumbnailPublicId
        );
        console.log("Deleted old thumbnail:", deleteResult);
      }

      updateData.thumbnail = req.file.path;
      updateData.thumbnailPublicId = req.file.filename;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    return res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}

async function togglePublish(req, res) {
  const { postId } = req.params;
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { ...req.body },
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
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (post && post.thumbnailPublicId) {
      await cloudinary.uploader.destroy(post.thumbnailPublicId);
    }

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

// Toggle like

async function toggleLike(req, res) {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        likedPosts: true,
      },
    });
    const hasLiked = user.likedPosts.some((post) => post.id === postId);
    if (hasLiked) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedPosts: {
            disconnect: {
              id: postId,
            },
          },
        },
      });
      return res.json({ liked: false });
    } else {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedPosts: {
            connect: {
              id: postId,
            },
          },
        },
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Toggle bookmark

async function toggleBookmark(req, res) {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookmarkedPosts: true,
      },
    });
    const hasBookmark = user.bookmarkedPosts.some((post) => post.id === postId);
    if (hasBookmark) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bookmarkedPosts: {
            disconnect: {
              id: postId,
            },
          },
        },
      });
      return res.json({ bookmarked: false });
    } else {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bookmarkedPosts: {
            connect: {
              id: postId,
            },
          },
        },
      });
      return res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// REPORT POST

async function reportPost(req, res) {
  const { postId } = req.params;
  const { reporterId, type, message } = req.body;
  const trimmedMessage = message?.trim() || "";

  try {
    const report = await prisma.postReport.upsert({
      where: {
        postId_reporterId: { postId, reporterId },
      },
      create: {
        postId,
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

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: "REPORTED" },
    });

    return res.status(200).json({
      message: report._count ? "Report updated" : "Report created",
      report,
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error reporting post:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Toggle Featured
async function toggleFeatured(req, res) {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        isFeatured: !post.isFeatured,
        featuredAt: !post.isFeatured ? new Date() : null,
      },
    });

    return res.status(200).json({
      featured: updatedPost.isFeatured,
      message: updatedPost.isFeatured
        ? "Post has been featured successfully"
        : "Post has been unfeatured successfully",
    });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET FEATURED POST
async function getFeaturedPost(req, res) {
  try {
    // Get 3 latest featured posts (only published & not DRAFT or BLOCKED)
    const featuredPosts = await prisma.post.findMany({
      where: {
        isFeatured: true,
        published: true,
        author: {
          suspensions: {
            none: {
              liftedAt: null,
            },
          },
        },
        status: {
          notIn: ["DRAFT", "BLOCKED"],
        },
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            fullName: true,
            userColor: true,
          },
        },
      },
      orderBy: {
        featuredAt: "desc",
      },
      take: 5,
    });

    // Get trending posts (only published & not DRAFT or BLOCKED)
    const trendingPosts = await prisma.post.findMany({
      where: {
        published: true,
        status: {
          notIn: ["DRAFT", "BLOCKED"],
        },
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            fullName: true,
            userColor: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likedBy: true,
          },
        },
      },
      orderBy: [
        {
          comments: {
            _count: "desc",
          },
        },
        {
          likedBy: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      take: 5,
    });

    const trendingWithScores = trendingPosts.map((post) => {
      const likesCount = post._count.likedBy;
      const commentsCount = post._count.comments;

      const hoursSinceCreation =
        (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      const recencyFactor = hoursSinceCreation <= 24 ? 2 : 1;

      const trendingScore =
        (2 * likesCount + 3 * commentsCount) * recencyFactor;

      const { _count, ...postWithoutCount } = post;
      return {
        ...postWithoutCount,
        likesCount,
        commentsCount,
        trendingScore,
      };
    });

    // Sort by computed score
    trendingWithScores.sort((a, b) => b.trendingScore - a.trendingScore);

    return res.status(200).json({
      featuredPosts,
      trendingPosts: trendingWithScores,
    });
  } catch (error) {
    console.error("Error fetching featured posts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function searchPost(req, res) {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(200).json([]);
  }
  const query = q.toLowerCase();

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          // { tags: { has: query } },
          {
            author: {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            fullName: true,
            userColor: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts", error);
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
  toggleLike,
  toggleBookmark,
  getLimitPost,
  simpleUpdatePost,
  togglePublish,
  reportPost,
  getFeaturedPost,
  toggleFeatured,
  searchPost,
};
