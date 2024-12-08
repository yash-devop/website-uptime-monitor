import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import redis, { createClient, RedisClientType } from "redis";
import { HealthCheckQueue } from "@/queues";
import { mockedPrismaClient } from "@/app/__mocks__/prisma";
import { prisma, URL_ALERT_TYPES } from "@repo/db";
import { MonitorType } from "@repo/common";
import { auth } from "@/utils/auth";
import { POST } from "@/app/api/(teams)/(monitors)/team/[teamId]/monitors/create/route";
import { createMockHTTP } from "@/utils/helper";

const BACKEND_URL = "http://localhost:3000";
beforeEach(() => {
  vi.clearAllMocks();
});
vi.mock("../../../utils/auth.ts", () => ({
  __esModule: true,
  auth: vi.fn(),
}));

vi.mock("@repo/db", () => ({
  prisma: mockedPrismaClient,
}));


vi.mock("../../../queues/index.ts",()=>({
  HealthCheckQueue: {
    add: vi.fn().mockResolvedValue({id: "1"}).mockResolvedValue({id: "2"})
  }
}))


const monitorData: MonitorType = {
  url: "https://www.google.com",
  alertUsing: "email",
  checkFrequency: "3000",
  confirmationPeriod: 10000,
  httpRequestTimeout: 1000,
  recoveryPeriod: 10000,
  urlAlias: `testing ${Math.random()}`,
  alertWhen: "URL_BECOMES_UNAVAILABLE",
  headerName: "AUTH",
  headerValue: "s",
  httpMethods: "get",
  httpRequestBody: "{}",
  regions: ["ams"],
  teamId: "cm42kp9st0003zq8bocm5s104",
};

describe("🟢 Monitor Testing Block ", () => {
  describe("Testing next-auth => auth fn", () => {
    it("1. should return 401 Unauthorized if user is not logged in", async () => {
      (auth as Mock).mockResolvedValue(null);     // mocking auth

      await auth();       // actuall auth
      const { req, res } = createMockHTTP({
        body: {},
        method: "POST",
      });

      const response = await POST(req, res);
      const data = await response.json();

      expect(data.message).toBe('Unauthorized access. Please Login');
    });
  });

  describe("Testing Monitor", () => {
    beforeEach(async () => {
      (auth as Mock).mockResolvedValue({
        user: {
          id: "1",
          name: "name-is-vitest",
          email: "vitesting-yash@gmail.com",
          image: "image.com",
        },
      });
      const session = await auth();
    });

    describe("2. zod should return a specific error for invalid inputs", () => {
      it("2.a) Invalid Inputs types", async () => {
        const invalidMonitorData = {
          ...monitorData,
          alertUsing: "jod",
          checkFrequency: 3000,
        }; // alertUsing must be "email" and checkFrequency must be string with specified values.

        const { req, res } = createMockHTTP({
          body: invalidMonitorData,
          method: "POST",
        });

        const response = await POST(req, res);

        const data = await response.json();

        expect(data.error[0]).toEqual(
          expect.objectContaining({
            field: expect.any(String),
            message: expect.any(String),
          })
        );
      });
      it("2.b) Invalid URL format", async () => {
        const invalidURLFormat = { ...monitorData, url: "www.google.com" };
        const { req, res } = createMockHTTP({
          body: invalidURLFormat,
          method: "POST",
        });

        const response = await POST(req, res);

        const data = await response.json();

        expect(data.error[0]).toMatchObject({
          field: "url",
          message: "Invalid url",
        });
      });
    });

    describe("3. POST / Create monitor", async () => {
      it("3.a) should return status code 200 if monitor is created successfully.", async () => {
        const {
          alertUsing,
          alertWhen,
          checkFrequency,
          confirmationPeriod,
          httpMethods,
          httpRequestTimeout,
          recoveryPeriod,
          regions,
          url,
          urlAlias,
          headerName,
          headerValue,
          httpRequestBody,
          teamId,
        } = monitorData;
        mockedPrismaClient.monitor.create.mockResolvedValue({
          // first use the mockedPrismaClient created from vitest-mock-extended
          checkFrequency,
          confirmationPeriod,
          httpRequestTimeout: Number(httpRequestTimeout),
          recoveryPeriod,
          url,
          urlAlias,
          alertUsing,
          alertWhen,
          headerName: headerName!,
          headerValue: headerValue!,
          httpMethods,
          httpRequestBody: httpRequestBody!,
          teamId,
          regions,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          id: Math.random().toString(),
        });

  
        const monitor = await prisma.monitor.create({
          // and then use the ACTUAL OG Prisma client instance ( from @prisma/client )
          data: {
            url,
            alertUsing,
            checkFrequency,
            confirmationPeriod,
            httpRequestTimeout: Number(httpRequestTimeout),
            recoveryPeriod,
            urlAlias,
            alertWhen,
            headerName,
            headerValue,
            httpMethods,
            httpRequestBody,
            regions,
            teamId,
          },
        });



  
        const { req, res } = createMockHTTP({
          method: "POST",
          body: { ...monitorData }
        });
        const response = await POST(req, res);
        const data = await response.json();
        expect(response.status).toBe(200)
        expect(data.message).toContain("Monitor created !")

        expect(HealthCheckQueue.add).toHaveBeenNthCalledWith(
          1, 
          expect.stringContaining("HealthCheckJob"), 
          expect.objectContaining(monitorData),
          { delay: 0, jobId: `HealthCheckJob-${monitor.id}`}
        );

        expect(HealthCheckQueue.add).toHaveBeenNthCalledWith(
          2, 
          expect.stringContaining("HealthCheckJob"),
          expect.objectContaining(monitorData),
          { repeat: { every: Number(monitorData.checkFrequency) }, jobId: `HealthCheckJob-${monitor.id}` }
        );
      });
    });
  });
});
