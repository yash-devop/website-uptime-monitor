/*
  Warnings:

  - Added the required column `url` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "url" TEXT NOT NULL;
