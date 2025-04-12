-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SPAM', 'ABUSE', 'MISINFORMATION', 'OTHER', 'PORNOGRAPHY');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'BLOCKED', 'REPORTED', 'ARCHIEVED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "PostStatus";

-- CreateTable
CREATE TABLE "PostReport" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReport" ADD CONSTRAINT "PostReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
