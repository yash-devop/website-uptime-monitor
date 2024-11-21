/*
  Warnings:

  - Changed the type of `httpRequestTimeout` on the `Monitor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "httpRequestTimeout",
ADD COLUMN     "httpRequestTimeout" INTEGER NOT NULL;
