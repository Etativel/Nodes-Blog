const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function insertUser() {
  const user = await prisma.user.create({
    data: {
      id: "user",
      username: "user",
      email: "user@gmail.com",
      password: "user",
      role: "ADMIN",
    },
  });
  console.log(user);
}

insertUser();
