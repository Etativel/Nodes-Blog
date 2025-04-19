const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            postId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    // Get all posts IDs by user
    const userPostIds = {};
    for (const user of users) {
      userPostIds[user.id] = user.posts.map((post) => post.id);
    }

    // Get all reports for posts
    const allReports = await prisma.postReport.findMany({
      include: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group reports by user (post author) ID
    const reportsByUser = {};
    for (const report of allReports) {
      const authorId = report.post.authorId;
      if (!reportsByUser[authorId]) {
        reportsByUser[authorId] = [];
      }
      reportsByUser[authorId].push({
        id: report.id,
        type: report.type.toLowerCase(),
        postId: report.postId,
        createdAt: report.createdAt.toISOString(),
      });
    }

    const suspensions = await prisma.suspension.findMany({
      where: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const latestSuspensionByUser = {};
    for (const suspension of suspensions) {
      if (!latestSuspensionByUser[suspension.userId]) {
        latestSuspensionByUser[suspension.userId] = suspension;
      }
    }

    // Transform users to match the expected format
    const formattedUsers = users.map((user) => {
      const latestSuspension = latestSuspensionByUser[user.id];
      const isActive = !(
        latestSuspension && latestSuspension.liftedAt === null
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        userColor: user.userColor || "#000000",
        biography: user.biography || "",
        fullName: user.fullName || "",
        profilePicture: user.profilePicture || "",
        postCount: user._count.posts,
        commentCount: user._count.comments,
        followerCount: user._count.followers,
        followingCount: user._count.following,
        active: isActive,
        posts: user.posts.map((post) => ({
          id: post.id,
          title: post.title,
          createdAt: post.createdAt.toISOString(),
        })),
        comments: user.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          postId: comment.postId,
          createdAt: comment.createdAt.toISOString(),
        })),
        reports: reportsByUser[user.id] || [],
      };
    });

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Failed to retrieve users data", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update user
async function updateUser(req, res) {
  const { userId } = req.params;
  const { fullName, username, role, biography, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName,
        username,
        role,
        biography,
        email,
      },
    });
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// User action (Suspension/activation)
async function suspendUser(req, res) {
  const { userId } = req.params;
  const { reason, createdBy, expiresAt } = req.body;

  try {
    const suspension = await prisma.suspension.create({
      data: {
        userId,
        reason,
        createdBy,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(201).json({
      message: "User suspended successfully.",
      suspension,
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    return res.status(500).json({ error: "Failed to suspend user." });
  }
}

async function liftSuspension(req, res) {
  const { userId } = req.params;
  const { liftReason } = req.body;

  try {
    const activeSuspension = await prisma.suspension.findFirst({
      where: {
        userId,
        liftedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activeSuspension) {
      return res.status(404).json({ error: "No active suspension found." });
    }

    const updatedSuspension = await prisma.suspension.update({
      where: { id: activeSuspension.id },
      data: {
        liftedAt: new Date(),
        liftReason,
      },
    });

    return res.status(200).json({
      message: "Suspension lifted successfully.",
      suspension: updatedSuspension,
    });
  } catch (error) {
    console.error("Error lifting suspension:", error);
    return res.status(500).json({ error: "Failed to lift suspension." });
  }
}

async function getUserSuspensions(req, res) {
  const { userId } = req.params;

  try {
    const suspensions = await prisma.suspension.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(suspensions);
  } catch (error) {
    console.error("Error fetching suspensions:", error);
    return res.status(500).json({ error: "Failed to retrieve suspensions." });
  }
}

module.exports = {
  getAllUsers,
  updateUser,
  suspendUser,
  liftSuspension,
  getUserSuspensions,
};
