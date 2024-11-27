-- CreateEnum
CREATE TYPE "WEB_STATUS" AS ENUM ('up', 'down');

-- CreateTable
CREATE TABLE "CheckLog" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "headers" TEXT,
    "statusCode" INTEGER,
    "isUp" BOOLEAN NOT NULL,
    "webStatus" "WEB_STATUS" NOT NULL,
    "down_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "monitorId" TEXT NOT NULL,

    CONSTRAINT "CheckLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckLog" ADD CONSTRAINT "CheckLog_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
