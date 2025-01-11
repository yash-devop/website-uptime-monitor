import { ConnectionOptions, Job, Worker } from "bullmq";
import { invokeLambda } from "./invokeLambda";
import { MonitorType } from "@repo/common";
import { config } from "dotenv";
import { prisma } from "@repo/db";
import { createClient } from "redis";
import { getPrettyDate, notifyIncidentToTeam } from "./utils";
import { format } from "date-fns";
config({ path: "../.env" });

console.log("Worker is running...");

const connection: ConnectionOptions = {
  host: "localhost",
  port: 6379,
};

type ResultResponse = {
  region: string;
  data: {
    url: string;
    responseTime?: number;
    down_at: Date | null;
    headers: Record<string, any>;
    statusCode?: number;
    isUp: boolean;
    webStatus: "up" | "down";
    success: boolean;
    error?: {
      name: string;
      cause: string;
    };
  };
};

const createRedisClient = () => {
  if (process.env.NODE_ENV === "production") {
    return createClient({ url: process.env.UPSTASH_REDIS_URL });
  }
  return createClient();
};

const client = createRedisClient();
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  }
})();

const worker = new Worker(
  "HealthCheckQueue",
  async (job: Job) => {
    const monitorData: MonitorType & { id: string } = job.data;
    console.log("monitorData", monitorData);
    const REGIONS = ["ap-south-1"];

    const AWS_RESPONSE = await Promise.all(
      REGIONS.map((region) =>
        invokeLambda(region, {
          monitorData,
          currentRegion: region,
        })
      )
    );

    AWS_RESPONSE.map(async (response) => {
      const websiteStatus = JSON.parse(
        JSON.parse(new TextDecoder("utf-8").decode(response.Payload)).body
      ) as ResultResponse;

      const { url, down_at, isUp, error } = websiteStatus.data;

      const teamExists = await prisma.team.findUnique({
        where: { id: monitorData.teamId },
        include: {
          members: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
        },
      });
      if (!teamExists) {
        throw new Error(`Team with ID ${monitorData.teamId} does not exist`);
      }

      const currentIncident = await prisma.incident.findFirst({
        where: {
          monitorId: monitorData.id,
          incidentStatus: { in: ["ongoing", "validating"] },
        },
        include: {
          team: { include: { members: { include: { user: true } } } },
        },
      });

      // Early return for "validating" status
      if (currentIncident?.incidentStatus === "validating") {
        if (!isUp) {
          // Website is still down → move back to ongoing
          await prisma.incident.update({
            where: { id: currentIncident.id },
            data: { incidentStatus: "ongoing" },
          });

          console.log("🔄 Status updated from validating to ongoing");
          const {
            teamId,
            createdAt,
            id,
            incidentName,
            incidentCause,
            team: { members },
          } = currentIncident;
          const startedAt = getPrettyDate(createdAt);
          await notifyIncidentToTeam(
            teamId,
            id,
            monitorData.urlAlias,
            members,
            url,
            incidentName,
            "ongoing",
            startedAt,
            error!.cause ?? incidentCause
          );
        } else {
          // Website is up → resolve the incident
          await prisma.incident.update({
            where: { id: currentIncident.id },
            data: { incidentStatus: "resolved", resolvedAt: new Date() },
          });

          console.log("✅ Status updated from validating to resolved");
          const {
            teamId,
            createdAt,
            id,
            incidentName,
            incidentCause,
            team: { members },
          } = currentIncident;
          const startedAt = getPrettyDate(createdAt);
          await notifyIncidentToTeam(
            teamId,
            id,
            monitorData.urlAlias,
            members,
            url,
            incidentName,
            "ongoing",
            startedAt,
            error!.cause ?? incidentCause
          );
        }
        return; // Early return for "validating"
      }

      // Other cases (ongoing, no incident, resolved, or no changes)
      if (!currentIncident) {
        if (!isUp) {
          // Creating a new incident if website is down
          const { teamId, createdAt, id, incidentName, incidentCause } =
            await prisma.incident.create({
              data: {
                url,
                incidentName: error!.name,
                incidentCause: error!.cause,
                incidentStatus: "ongoing",
                monitorId: monitorData.id,
                teamId: monitorData.teamId,
                down_at,
              },
            });

          console.log("⚠️ New incident created (ongoing)");
          const startedAt = getPrettyDate(createdAt);
          await notifyIncidentToTeam(
            teamId,
            id,
            monitorData.urlAlias,
            teamExists.members,
            url,
            incidentName,
            "ongoing",
            startedAt,
            error!.cause ?? incidentCause
          );
        } else {
          console.log("✅ Website is up and no incidents to update");
        }
        return;
      }

      if (currentIncident.incidentStatus === "ongoing") {
        if (isUp) {
          // Resolve the ongoing incident if website is back up
          await prisma.incident.update({
            where: { id: currentIncident.id },
            data: { incidentStatus: "resolved", resolvedAt: new Date() },
          });

          console.log("✅ Ongoing incident resolved");
          const {
            teamId,
            createdAt,
            id,
            incidentName,
            incidentCause,
            team: { members },
          } = currentIncident;

          const startedAt = getPrettyDate(createdAt);

          await notifyIncidentToTeam(
            teamId,
            id,
            monitorData.urlAlias,
            members,
            url,
            incidentName,
            "resolved",
            startedAt,
            error!.cause ?? incidentCause
          );
        } else {
          console.log(
            "🚨 Website is still down; ongoing incident remains unchanged"
          );
        }
        return;
      }

      // Publishing to redis pub/sub
      try {
        const published = await client.publish(
          `HealthCheckJob-${monitorData.id}`,
          JSON.stringify(websiteStatus)
        );
        console.log("👌 Published : ", published);
      } catch (error) {
        console.error("❌ ERROR while publishing to Redis: ", error);
      }
    });
  },
  {
    connection,
  }
);

worker.on("completed", () => {
  console.log("I'm free now.");
});
