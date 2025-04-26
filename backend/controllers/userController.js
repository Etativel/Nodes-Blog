const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinaryConfig");

// Utils
function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Get all user
async function getAllUser(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userColor: true,
        biography: true,
        fullName: true,
        profilePicture: true,
        profilePicturePublicId: true,
        isDark: true,
        suspensions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!users || users.length === 0) {
      return res.json({ message: "No user found" });
    }
    return res.json({ users });
  } catch (error) {
    console.error("Failed to get all users", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSpecificUser(req, res) {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        fullName: true,
        userColor: true,
        biography: true,
        profilePicture: true,
        profilePicturePublicId: true,
        isDark: true,
        createdAt: true,
        updatedAt: true,

        followers: {
          select: {
            followerId: true,
            follower: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        following: {
          select: {
            followingId: true,
            following: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Failed to get user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSpecificAdmin(req, res) {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        fullName: true,
        userColor: true,
        biography: true,
        profilePicture: true,
        profilePicturePublicId: true,
        isDark: true,
        createdAt: true,
        updatedAt: true,
        email: true,

        followers: {
          select: {
            followerId: true,
            follower: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        following: {
          select: {
            followingId: true,
            following: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Failed to get user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Get user by email and username
async function getUserByEmail(req, res) {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.json({ available: true, message: "Email is available." });
    }
    return res.json({ available: false, message: "Email already taken." });
  } catch (error) {
    console.error("Failed to get user by email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserByUsername(req, res) {
  const { username } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.json({ available: true, message: "Username is available." });
    }
    return res.json({ available: false, message: "Username already taken." });
  } catch (error) {
    console.error("Failed to get user by username:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getProfileByUsername(req, res) {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userColor: true,
        biography: true,
        fullName: true,
        profilePicture: true,
        profilePicturePublicId: true,
        isDark: true,
        followers: true,
        following: true,
        about: true,
        likedPosts: {
          where: {
            author: {
              suspensions: { none: { liftedAt: null } },
            },
          },
          select: {
            id: true,
            title: true,
            thumbnail: true,
            excerpt: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                userColor: true,
                profilePicture: true,
                username: true,
                fullName: true,
              },
            },
            _count: {
              select: { likedBy: true },
            },
            comments: true,
            likedBy: true,
          },
        },
        bookmarkedPosts: {
          where: {
            author: {
              suspensions: { none: { liftedAt: null } },
            },
          },
          select: {
            id: true,
            title: true,
            thumbnail: true,
            excerpt: true,
            createdAt: true,

            author: {
              select: {
                id: true,
                userColor: true,
                profilePicture: true,
                username: true,
                fullName: true,
              },
            },
            _count: {
              select: { likedBy: true },
            },
            comments: true,
            likedBy: true,
          },
        },
        suspensions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!user) {
      return res.json({ message: "Profile not found." });
    }
    if (user.suspensions[0]?.liftedAt === null) {
      return res.json({ message: "User suspended." });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Failed to get profile by username:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Followers

async function followUser(req, res) {
  const { followerId, followingId } = req.body;

  try {
    const follow = await prisma.follower.create({
      data: {
        followerId,
        followingId,
      },
    });
    return res.status(201).json({ follow });
  } catch (error) {
    console.error("Error following", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function unFollowUser(req, res) {
  const { followingId, followerId } = req.body;
  try {
    const unfollow = await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return res.json({ unfollow });
  } catch (error) {
    console.error("Failed to unfollow user, ", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserFollow(req, res) {
  const { userId } = req.params;

  try {
    const userWithFollows = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            following: {
              suspensions: { none: { liftedAt: null } },
            },
          },
          select: {
            following: {
              select: {
                username: true,
                fullName: true,
                biography: true,
                userColor: true,
                profilePicture: true,
              },
            },
          },
        },
        following: {
          where: {
            follower: {
              suspensions: { none: { liftedAt: null } },
            },
          },
          select: {
            follower: {
              select: {
                username: true,
                fullName: true,
                biography: true,
                userColor: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!userWithFollows) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingUsers = userWithFollows.followers.map((f) => f.following);
    const followerUsers = userWithFollows.following.map((f) => f.follower);

    return res.status(200).json({
      followers: followerUsers,
      following: followingUsers,
    });
  } catch (error) {
    console.error("Failed to load follows:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Create user
async function createUser(req, res) {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        userColor: getRandomColor(),
        isDark: false,
        role: "ADMIN",
      },
    });
    return res.status(201).json({ newUser });
  } catch (error) {
    console.error("Failed to create user, ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update profile

async function updateProfile(req, res) {
  const { fullName, biography, userId, removeProfilePicture } = req.body;
  let profilePicture = null;
  let profilePicturePublicId = null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      profilePicture = req.file.path;
      profilePicturePublicId = req.file.filename;

      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }
    } else if (removeProfilePicture === "true") {
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }
      profilePicture = null;
      profilePicturePublicId = null;
    } else {
      profilePicture = user.profilePicture;
      profilePicturePublicId = user.profilePicturePublicId;
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: { biography, fullName, profilePicture, profilePicturePublicId },
    });

    return res.status(200).json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update user
async function updateUser(req, res) {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
      },
    });
    return res.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update user, ", error);
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUserField(req, res) {
  const { userId } = req.params;

  try {
    const updateData = { ...req.body };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    console.error("Update user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Delete user
async function deleteUser(req, res) {
  const { userId } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.json({ deletedUser });
  } catch (error) {
    console.error("Failed to delete user, ", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function toggleTheme(req, res) {
  const { userId } = req.params;
  const { isDark } = req.body;
  try {
    const userTheme = await prisma.user.update({
      where: { id: userId },
      data: { isDark },
    });
    return res.json({ userTheme });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Failed to toggle theme", error);
  }
}

async function getTheme(req, res) {
  const { userId } = req.params;

  try {
    const theme = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isDark: true,
      },
    });

    return res.json({ theme });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Failed to get theme", error);
  }
}

async function updateUserAbout(req, res) {
  const { userId } = req.params;
  const { about } = req.body;

  try {
    const updatedAbout = await prisma.user.update({
      where: { id: userId },
      data: {
        about,
      },
    });

    return res.status(200).json({ updatedAbout });
  } catch (error) {
    console.error("Failed to update user about", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
  getSpecificUser,
  getUserByUsername,
  getUserByEmail,
  updateProfile,
  getProfileByUsername,
  followUser,
  unFollowUser,
  updateUserField,
  getSpecificAdmin,
  toggleTheme,
  getTheme,
  updateUserAbout,
  getUserFollow,
};
