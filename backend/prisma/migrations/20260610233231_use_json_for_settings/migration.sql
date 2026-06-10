/*
  Warnings:

  - You are about to drop the column `horizontalGap` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `nodeBgColor` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `nodeTextColor` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `verticalStep` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "horizontalGap",
DROP COLUMN "nodeBgColor",
DROP COLUMN "nodeTextColor",
DROP COLUMN "theme",
DROP COLUMN "verticalStep",
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
