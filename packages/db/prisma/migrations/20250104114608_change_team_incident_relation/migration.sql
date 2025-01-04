-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_teamId_fkey";

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
