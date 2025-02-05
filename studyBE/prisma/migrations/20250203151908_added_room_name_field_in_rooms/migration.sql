/*
  Warnings:

  - Added the required column `roomName` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "roomName" TEXT NOT NULL;
