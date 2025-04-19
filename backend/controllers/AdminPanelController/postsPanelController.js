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

async function updatePostStatus(req, res) {
  const { postId } = req.params;
  const { status } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status,
      },
    });
    return res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
}

module.exports = {
  getAllPosts,
  updatePostStatus,
};
