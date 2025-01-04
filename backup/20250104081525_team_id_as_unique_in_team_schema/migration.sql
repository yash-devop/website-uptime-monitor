/*
  Warnings:

  - A unique constraint covering the columns `[teamId]` on the table `TeamMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_teamId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_teamId_key" ON "TeamMembership"("teamId");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "TeamMembership"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
