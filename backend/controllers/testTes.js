const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function changeField() {
  await prisma.post.updateMany({
    where: {
      status: "DEFAULT",
    },
    data: {
      status: "ACTIVE",
    },
  });
}

changeField()
  .then(() => {
    console.log("Update complete");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error updating posts:", error);
    prisma.$disconnect();
  });
