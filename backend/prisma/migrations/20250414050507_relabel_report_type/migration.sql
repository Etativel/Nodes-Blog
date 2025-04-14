/*
  Warnings:

  - The values [SPAM,ABUSE,MISINFORMATION,OTHER,PORNOGRAPHY] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('sexual_content', 'violent_content', 'hateful_content', 'harassment', 'dangerous_acts', 'misinformation', 'child_abuse', 'terrorism', 'spam_misleading');
ALTER TABLE "PostReport" ALTER COLUMN "type" TYPE "ReportType_new" USING ("type"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "ReportType_old";
COMMIT;
