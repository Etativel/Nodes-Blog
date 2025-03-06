const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getUser(username) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
}

async function getUserById(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

module.exports = {
  getUser,
  getUserById,
};
