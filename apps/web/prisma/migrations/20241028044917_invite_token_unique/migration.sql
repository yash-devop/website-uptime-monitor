/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invitation_inviteToken_key" ON "Invitation"("inviteToken");
