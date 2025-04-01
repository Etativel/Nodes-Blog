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
    const users = await prisma.user.findMany();
    if (!users) {
      return res.json({ message: "No user found" });
    }
    return res.json({ users });
  } catch (error) {
    console.error("Failed to get all user ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSpecificUser(req, res) {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.json({ message: "No user found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Failed to get user ", error);
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
      where: { username },
    });
    if (!user) {
      return res.json({ message: "profile not found." });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Failed to get profile by username:", error);
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
      where: {
        id: userId,
      },
    });
    if (req.file && removeProfilePicture !== "true") {
      profilePicture = req.file.path;
      profilePicturePublicId = req.file.filename;
    }

    if (removeProfilePicture === "true" && !req.file) {
      if (user && user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }
      profilePicture = null;
      profilePicturePublicId = null;
    }
    const updateProfile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        biography,
        fullName,
        profilePicture,
        profilePicturePublicId,
      },
    });
    return res.status(200).json({ profile: updateProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "internal server error" });
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
      // Unique constraint failed: username or email already exists.
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }
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
};
