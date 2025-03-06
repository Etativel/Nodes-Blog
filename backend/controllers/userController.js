const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// Get all user
async function getAllUser(req, res) {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      res.json({ message: "No user found" });
    }
    res.json({ users });
  } catch (error) {
    console.error("Failed to get all user ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create user
async function createUser(req, res) {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ newUser });
  } catch (error) {
    console.error("Failed to create user, ", error);
    res.status(500).json({ error: "Internal server error" });
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
        username,
        email,
        password,
      },
    });
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update user, ", error);
    if (error.code === "P2002") {
      // Unique constraint failed: username or email already exists.
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
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

    res.json({ deletedUser });
  } catch (error) {
    console.error("Failed to delete user, ", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
};
