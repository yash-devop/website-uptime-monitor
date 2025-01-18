-- DropForeignKey
ALTER TABLE "CheckLog" DROP CONSTRAINT "CheckLog_monitorId_fkey";

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_monitorId_fkey";

-- AddForeignKey
ALTER TABLE "CheckLog" ADD CONSTRAINT "CheckLog_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
