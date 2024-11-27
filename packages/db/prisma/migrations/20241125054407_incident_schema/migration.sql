/*
  Warnings:

  - A unique constraint covering the columns `[monitorId]` on the table `CheckLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "INCIDENT_STATUS" AS ENUM ('ongoing', 'validating', 'resolved');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "incidentName" TEXT NOT NULL,
    "incidentCause" TEXT NOT NULL,
    "incidentStatus" "INCIDENT_STATUS" NOT NULL,
    "length" INTEGER NOT NULL,
    "responseContent" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "monitorId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Incident_monitorId_key" ON "Incident"("monitorId");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_teamId_key" ON "Incident"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckLog_monitorId_key" ON "CheckLog"("monitorId");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "TeamMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
