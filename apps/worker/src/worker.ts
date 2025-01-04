import { ConnectionOptions, Job, Queue, Worker } from "bullmq";
import { invokeLambda } from "./invokeLambda";
import { MonitorType } from "@repo/common";
import { config } from "dotenv";
import { prisma } from "@repo/db";
config();
import redis, { createClient, RedisClientType } from "redis";
// import { InvokeCommandOutput } from "@aws-sdk/client-lambda";

console.log("WORKING");

const connection: ConnectionOptions = {
  host: "localhost",
  port: 6379,
};
type redisType = RedisClientType<
  redis.RedisModules,
  redis.RedisFunctions,
  redis.RedisScripts
>;

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

// const localRedis = createClient(); // TODO: In production , use upstash and in Development use Local redis.
// let client: redisType;
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
    process.exit(1); // Exit the process if Redis fails to connect
  }
})();

const worker = new Worker(
  "HealthCheckQueue",
  async (job: Job) => {
    const monitorData: MonitorType & { id: string } = job.data;
    console.log('monitorData',monitorData);
    const REGIONS = ["ap-south-1"];
    const AWS_RESPONSE = await Promise.all(
      REGIONS.map((region) =>
        invokeLambda(region, {
          monitorData,
          currentRegion: region,
        })
      )
    );

    const parsedResponses = AWS_RESPONSE.map(async (response) => {
      const websiteStatus = JSON.parse(
        JSON.parse(new TextDecoder("utf-8").decode(response.Payload)).body
      ) as ResultResponse;

      const {
        url,
        responseTime,
        down_at,
        headers,
        isUp,
        statusCode,
        webStatus,
        success,
        error,
      } = websiteStatus.data;
      console.log('websiteStatus.data',websiteStatus.data);

      const region = websiteStatus.region;

      const teamExists = await prisma.team.findUnique({
        where: { id: monitorData.teamId }
      });
      console.log('TeamExists',teamExists);
      
      if (!teamExists) {
        throw new Error(`Team with ID ${monitorData.teamId} does not exist`);
      }
      
      // Fetch the current state from the database
      let dbState;
      try {
        dbState = await prisma.checkLog.findFirst({
          where: {
            monitorId: monitorData.id,
            region,
          },
        });
      } catch (error) {
        console.error("❌ ERROR fetching CheckLog from DB: ", error);
        return;
      }

      // If there's no existing state, create a new one
      if (!dbState) {
        try {
          await prisma.checkLog.create({
            data: {
              isUp,
              region,
              responseTime,
              webStatus,
              down_at: isUp ? null : down_at,
              up_at: isUp ? new Date() : null,
              headers: JSON.stringify(headers),
              statusCode,
              monitorId: monitorData.id,
            },
          });

          if (!isUp) {
            console.log("⚠️ Initial state is DOWN, creating incident");
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
          }
        } catch (error) {
          console.error("❌ ERROR while creating initial CheckLog or Incident: ", error);
        }
        return;
      }

      // If there's a state transition, handle it
      if (dbState.isUp !== isUp) {
        console.log("✅ Transition Detected:", dbState.isUp, "→", isUp);

        if (!isUp) {
          console.log("⚠️ Website is DOWN");
          try {
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
          } catch (error) {
            console.error("❌ ERROR while creating Incident: ", error);
          }
        }

        try {
          await prisma.checkLog.create({
            data: {
              isUp,
              region,
              responseTime,
              webStatus,
              down_at: isUp ? null : down_at,
              up_at: isUp ? new Date() : null,
              headers: JSON.stringify(headers),
              statusCode,
              monitorId: monitorData.id,
            },
          });
        } catch (error) {
          console.error("❌ ERROR while creating CheckLog after transition: ", error);
        }
        return;
      }

      // No state transition, log current state
      console.log("❌ No Transition:", dbState.isUp, "=", isUp);
      try {
        await prisma.checkLog.create({
          data: {
            isUp,
            region,
            responseTime,
            webStatus,
            down_at: dbState.down_at,
            up_at: dbState.up_at,
            headers: JSON.stringify(headers),
            statusCode,
            monitorId: monitorData.id,
          },
        });
      } catch (error) {
        console.error("❌ ERROR while logging current state: ", error);
      }

      // await prisma.incident.create({
      //   data: {
      //     url,
      //     incidentName: error!.name,
      //     incidentCause: error!.cause,
      //     incidentStatus: "ongoing",
      //     monitorId: monitorData.id,
      //     teamId: "cm42kp9st0003zq8bocm5s104",
      //     // teamId: monitorData.teamId,
      //     down_at,
      //   },
      // });

      // Publish the status to Redis
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


worker.on("completed", () => {
  console.log("Im free now.");
});
