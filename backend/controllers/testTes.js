const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // delete all comment‑reports
  // await prisma.commentReport.deleteMany({});
  // delete all post‑reports
  await prisma.postReport.deleteMany({});

  console.log("✅ All reports have been deleted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
