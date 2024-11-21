-- CreateEnum
CREATE TYPE "URL_ALERT_TYPES" AS ENUM ('URL_BECOMES_UNAVAILABLE', 'URL_DOESNT_HAVE_KEYWORD', 'URL_HAVE_KEYWORD');

-- CreateEnum
CREATE TYPE "ALERT_USING" AS ENUM ('email');

-- CreateEnum
CREATE TYPE "HTTP_METHODS" AS ENUM ('get', 'post', 'put');

-- CreateTable
CREATE TABLE "Monitor" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlAlias" TEXT NOT NULL,
    "alertWhen" "URL_ALERT_TYPES" NOT NULL DEFAULT 'URL_BECOMES_UNAVAILABLE',
    "alertUsing" "ALERT_USING" NOT NULL DEFAULT 'email',
    "recoveryPeriod" INTEGER NOT NULL,
    "confirmationPeriod" INTEGER NOT NULL,
    "checkFrequency" TEXT NOT NULL,
    "httpMethods" "HTTP_METHODS" NOT NULL DEFAULT 'get',
    "httpRequestTimeout" TEXT NOT NULL,
    "httpRequestBody" TEXT,
    "headerName" TEXT,
    "headerValue" TEXT,
    "regions" TEXT[],
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
