const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllComments(req, res) {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            role: true,
            profilePicture: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                username: true,
                role: true,
                profilePicture: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform comments to match the required structure
    const formattedComments = comments
      .map((comment) => {
        // Only include parent comments (not replies)
        if (comment.parentId === null) {
          return {
            id: comment.id,
            content: comment.content,
            postId: comment.postId,
            postTitle: comment.post.title,
            authorId: comment.authorId,
            author: comment.author
              ? {
                  username: comment.author.username,
                  role: comment.author.role,
                  profilePicture: comment.author.profilePicture,
                }
              : null,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
            parentId: comment.parentId,
            replies: comment.replies.map((reply) => ({
              id: reply.id,
              content: reply.content,
              postId: reply.postId,
              authorId: reply.authorId,
              author: reply.author
                ? {
                    username: reply.author.username,
                    role: reply.author.role,
                    profilePicture: reply.author.profilePicture,
                  }
                : null,
              createdAt: reply.createdAt.toISOString(),
              updatedAt: reply.updatedAt.toISOString(),
              parentId: reply.parentId,
            })),
            reactions: comment.reactions.map((reaction) => ({
              id: reaction.id,
              userId: reaction.userId,
              reaction: reaction.reaction,
              createdAt: reaction.createdAt.toISOString(),
            })),
            // We need to fetch reports separately since they're associated with posts in the schema
            reports: [], // Will be populated by getReportedComments
            status: "DEFAULT",
          };
        }
      })
      .filter(Boolean); // Remove undefined values (replies)

    // Get reported comments
    const reportedComments = await getReportedComments(formattedComments);

    return res.status(200).json({ comments: reportedComments });
  } catch (error) {
    console.error("Failed to retrieve comments data", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllComments,
};
