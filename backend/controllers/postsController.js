const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllPosts(req, res) {
  try {
    const post = await prisma.post.findMany();
    res.json({ posts });
  } catch (error) {
    console.error("Erroc fetching posts", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getPost(req, res) {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.json({ error: "Post not found" });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllPosts,
  getPost,
};
