const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all posts
async function getAllPosts(req, res) {
  try {
    const allPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            username: true,
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response to match the expected data structure
    const formattedPosts = allPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      status: post.status,
      author: { username: post.author.username },
      createdAt: post.createdAt,
      reports: post.reports.map((report) => ({
        id: report.id,
        type: report.type,
        message: report.message,
        createdAt: report.createdAt,
        reporter: report.reporter.username,
      })),
    }));

    return res.json({ allPosts: formattedPosts });
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get all reported posts with their reports

async function getReportedPosts(req, res) {
  try {
    const reportedPosts = await prisma.post.findMany({
      where: {
        status: "REPORTED",
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            username: true,
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response to match the expected data structure
    const formattedPosts = reportedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      status: post.status,
      author: { username: post.author.username },
      createdAt: post.createdAt,
      reports: post.reports.map((report) => ({
        id: report.id,
        type: report.type,
        message: report.message,
        createdAt: report.createdAt,
        reporter: report.reporter.username,
      })),
    }));

    return res.json({ reportedPosts: formattedPosts });
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get a specific reported post with details
async function getReportedPostDetails(req, res) {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
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
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json({ post });
  } catch (error) {
    console.error("Error fetching reported post details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Filter reported posts by criteria
async function filterReportedPosts(req, res) {
  const {
    reportType,
    startDate,
    endDate,
    username,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    const whereConditions = {
      status: "REPORTED",
    };

    // Add report type filter if provided
    if (reportType) {
      whereConditions.reports = {
        some: {
          type: reportType,
        },
      };
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      whereConditions.createdAt = {};

      if (startDate) {
        whereConditions.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        whereConditions.createdAt.lte = new Date(endDate);
      }
    }

    // Add username filter if provided
    if (username) {
      whereConditions.author = {
        username: {
          contains: username,
          mode: "insensitive",
        },
      };
    }

    // Set up sort options
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const reportedPosts = await prisma.post.findMany({
      where: whereConditions,
      select: {
        id: true,
        title: true,
        excerpt: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            username: true,
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
      },
      orderBy,
    });

    return res.json({ reportedPosts });
  } catch (error) {
    console.error("Error filtering reported posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Take action on a reported post
async function moderatePost(req, res) {
  const { postId } = req.params;
  const { action, moderatorId, moderationNote } = req.body;

  try {
    // Verify the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let updatedPost;

    switch (action) {
      case "approve":
        // Change status to DEFAULT (approved)
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { status: "DEFAULT" },
        });
        break;

      case "block":
        // Change status to BLOCKED
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { status: "BLOCKED" },
        });
        break;

      case "archive":
        // Change status to ARCHIEVED
        updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { status: "ARCHIEVED" },
        });
        break;

      default:
        return res.status(400).json({
          error: "Invalid action. Use 'approve', 'block', or 'archive'.",
        });
    }

    // Log the moderation action (if you want to add a moderation log table in the future)
    // This would require adding a new model to your schema
    /*
    await prisma.moderationLog.create({
      data: {
        postId,
        moderatorId,
        action,
        note: moderationNote,
      }
    });
    */

    return res.json({
      message: `Post has been ${action}d successfully`,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error moderating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get reporting analytics
async function getReportingAnalytics(req, res) {
  try {
    // Count reports by type
    const reportsByType = await prisma.postReport.groupBy({
      by: ["type"],
      _count: true,
    });

    // Count reports by day for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const reportsByDay = await prisma.postReport.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: true,
    });

    // Process reportsByDay to format by day
    const dayCount = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      dayCount[dateString] = 0;
    }

    reportsByDay.forEach((item) => {
      const dateString = item.createdAt.toISOString().split("T")[0];
      dayCount[dateString] = item._count;
    });

    // Find top reporters
    const topReporters = await prisma.postReport.groupBy({
      by: ["reporterId"],
      _count: true,
      orderBy: {
        _count: {
          reporterId: "desc",
        },
      },
      take: 5,
    });

    // Get usernames for top reporters
    const topReportersWithNames = await Promise.all(
      topReporters.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.reporterId },
          select: { username: true },
        });
        return {
          username: user.username,
          reportCount: item._count,
        };
      })
    );

    return res.json({
      reportsByType,
      reportsByDay: Object.entries(dayCount).map(([date, count]) => ({
        date,
        count,
      })),
      topReporters: topReportersWithNames,
    });
  } catch (error) {
    console.error("Error fetching reporting analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Check for any posts with multiple reports that need attention
async function getHighPriorityReports(req, res) {
  try {
    // Find posts with multiple reports
    const postsWithMultipleReports = await prisma.post.findMany({
      where: {
        status: "REPORTED",
        reports: {
          some: {},
        },
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        createdAt: true,
        author: {
          select: {
            username: true,
          },
        },
        reports: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    });

    // Filter to only include posts with multiple reports and sort by count
    const highPriorityPosts = postsWithMultipleReports
      .filter((post) => post.reports.length > 1)
      .map((post) => ({
        ...post,
        reportCount: post.reports.length,
        reportTypes: [...new Set(post.reports.map((report) => report.type))],
      }))
      .sort((a, b) => b.reportCount - a.reportCount);

    return res.json({ highPriorityPosts });
  } catch (error) {
    console.error("Error fetching high priority reports:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllPosts,
  getReportedPosts,
  getReportedPostDetails,
  filterReportedPosts,
  moderatePost,
  getReportingAnalytics,
  getHighPriorityReports,
};
