-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "featuredAt" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isDark" DROP DEFAULT;
