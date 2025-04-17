const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getSummaryStats(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    const totalPublishedPosts = await prisma.post.count({
      where: {
        published: true,
      },
    });

    const totalReportedPosts = await prisma.post.count({
      where: {
        status: "REPORTED",
      },
    });

    const totalComments = await prisma.comment.count();

    return res.json({
      totalUsers,
      totalPublishedPosts,
      totalReportedPosts,
      totalComments,
    });
  } catch (error) {
    console.error("Error fetching summary statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getReportStats(req, res) {
  try {
    const reportCounts = await prisma.postReport.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    const formattedReportCounts = {};
    reportCounts.forEach((report) => {
      formattedReportCounts[report.type] = report._count.type;
    });

    return res.json({ reportCounts: formattedReportCounts });
  } catch (error) {
    console.error("Error fetching report statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getPostStatusStats(req, res) {
  try {
    const statusCounts = await prisma.post.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const formattedStatusCounts = {
      DEFAULT: 0,
      DRAFT: 0,
      BLOCKED: 0,
      REPORTED: 0,
      ARCHIEVED: 0,
    };

    statusCounts.forEach((status) => {
      if (status.status) {
        formattedStatusCounts[status.status] = status._count.status;
      }
    });

    return res.json({ postStatusCounts: formattedStatusCounts });
  } catch (error) {
    console.error("Error fetching post status statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getRecentReports(req, res) {
  const limit = parseInt(req.query.limit) || 12;

  try {
    const recentReports = await prisma.postReport.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          select: {
            title: true,
          },
        },
        reporter: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedReports = recentReports.map((report) => ({
      id: report.id,
      type: report.type,
      createdAt: report.createdAt.toISOString(),
      reporter: report.reporter.username,
      postTitle: report.post.title,
    }));

    return res.json({ recentReports: formattedReports });
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function getLastMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end };
}

async function getAllStats(req, res) {
  try {
    const totalUsers = await prisma.user.count();
    const totalPublishedPosts = await prisma.post.count({
      where: {
        published: true,
      },
    });
    const totalReportedPosts = await prisma.post.count({
      where: {
        status: "REPORTED",
      },
    });
    const totalComments = await prisma.comment.count();
    const reportCounts = await prisma.postReport.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    const formattedReportCounts = {};
    reportCounts.forEach((report) => {
      formattedReportCounts[report.type] = report._count.type;
    });

    const statusCounts = await prisma.post.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const formattedStatusCounts = {
      DEFAULT: 0,
      DRAFT: 0,
      BLOCKED: 0,
      REPORTED: 0,
      ARCHIEVED: 0,
    };

    statusCounts.forEach((status) => {
      if (status.status) {
        formattedStatusCounts[status.status] = status._count.status;
      }
    });

    const recentReports = await prisma.postReport.findMany({
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          select: {
            title: true,
            id: true,
            author: true,
          },
        },
        reporter: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedReports = recentReports.map((report) => ({
      id: report.id,
      type: report.type,
      createdAt: report.createdAt.toISOString(),
      reporter: report.reporter.username,
      postTitle: report.post.title,
      postId: report.post.id,
      author: report.post.author,
    }));

    const { start, end } = getLastMonthRange();

    const lastMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: start, lt: end } },
    });

    const lastMonthPosts = await prisma.post.count({
      where: {
        published: true,
        createdAt: { gte: start, lt: end },
      },
    });

    const lastMonthReports = await prisma.post.count({
      where: {
        status: "REPORTED",
        updatedAt: { gte: start, lt: end },
      },
    });

    const lastMonthComments = await prisma.comment.count({
      where: { createdAt: { gte: start, lt: end } },
    });

    function getTrend(current, previous) {
      if (previous === 0) {
        if (current === 0) {
          return { label: "0%", isPositive: null };
        }
        return { label: "+100%", isPositive: true };
      }

      const diff = current - previous;
      const percent = ((diff / previous) * 100).toFixed(1);
      const symbol = diff >= 0 ? "+" : "";
      return {
        label: `${symbol}${percent}%`,
        isPositive: diff >= 0,
      };
    }

    const trends = {
      users: getTrend(totalUsers, lastMonthUsers),
      posts: getTrend(totalPublishedPosts, lastMonthPosts),
      reports: getTrend(totalReportedPosts, lastMonthReports),
      comments: getTrend(totalComments, lastMonthComments),
    };

    return res.json({
      totalUsers,
      totalPublishedPosts,
      totalReportedPosts,
      totalComments,
      reportCounts: formattedReportCounts,
      postStatusCounts: formattedStatusCounts,
      recentReports: formattedReports,
      trends,
    });
  } catch (error) {
    console.error("Error fetching all statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserStats(req, res) {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likedPosts: true,
            bookmarkedPosts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const reportCount = await prisma.postReport.count({
      where: { reporterId: userId },
    });

    return res.json({
      username: user.username,
      stats: {
        posts: user._count.posts,
        comments: user._count.comments,
        likes: user._count.likedPosts,
        bookmarks: user._count.bookmarkedPosts,
        followers: user._count.followers,
        following: user._count.following,
        reports: reportCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getSummaryStats,
  getReportStats,
  getPostStatusStats,
  getRecentReports,
  getAllStats,
  getUserStats,
};
