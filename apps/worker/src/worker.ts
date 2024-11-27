import { ConnectionOptions, Job, Worker } from "bullmq";
import { invokeLambda } from "./invokeLambda";
import { MonitorType } from "@repo/common";
import { config } from "dotenv";
import {prisma} from "@repo/db";
config();
import redis, { createClient, RedisClientType } from "redis";
// import { InvokeCommandOutput } from "@aws-sdk/client-lambda";

console.log('WORKING');

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
    responseTime: number;
    down_at: Date | null;
    headers: Record<string, any>;
    statusCode: number;
    isUp: boolean;
    webStatus: "up" | "down";
    success: boolean,
    error: {
      errorName: string;
      errorCause: string;
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
client.connect().catch((err) => {
  console.log("Failed to connect to redis: ", err);
});

const worker = new Worker(
  "HealthCheckQueue",
  async (job: Job) => {
    const monitorData: MonitorType & { id: string } = job.data;
    const REGIONS = ["ap-south-1"];
    const AWS_RESPONSE = await Promise.all(
      // Later: promise.allSettled.
      REGIONS.map((region) =>
        invokeLambda(region, {
          monitorData,
          currentRegion: region,
        })
      )
    );

    const parsedResponses = AWS_RESPONSE.map(async (response) => {
      const websiteStatus = JSON.parse(
        new TextDecoder("utf-8").decode(response.Payload)
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

      const region = websiteStatus.region;

      // checklog.
      try {
        const dbState = await prisma.checkLog.findUnique({
          where: {
            monitorId: monitorData.id,
            region,
          },
        });

        if (dbState) {
          if (dbState?.isUp !== isUp) {
            // Boolean: transition from up to down or down to up
            if (!isUp) {
              // transistion happens and new ping response is DOWN.
              await prisma.incident.create({
                data: {
                  incidentName: url,
                  incidentCause: error.errorName,
                  incidentStatus: "ongoing",
                  monitorId: monitorData.id,
                  teamId: monitorData.teamId,
                },
              });
              await prisma.checkLog.update({
                data: {
                  isUp: false,
                  responseTime,
                  region,
                  statusCode,
                  webStatus,
                  down_at,
                  headers,
                },
                where: {
                  monitorId: monitorData.id,
                },
              });
            } else {
              // transistion happens and new ping response is UP.
              await prisma.checkLog.update({
                data: {
                  isUp: true,
                  responseTime,
                  region,
                  statusCode,
                  webStatus,
                  down_at,
                  headers,
                },
                where: {
                  monitorId: monitorData.id,
                },
              });
            }
          }
        } else {
          // create checkLog
          await prisma.checkLog.create({
            data: {
              isUp,
              region,
              responseTime,
              webStatus,
              down_at,
              headers: JSON.stringify(headers),
              statusCode,
              monitorId: monitorData.id,
            },
          });
        }
      } catch (error) {
        console.log("❌ ERROR while updating CheckLogs DB: ", error);
      }
    });

    console.log("all_responses: ", parsedResponses);
    const published = await client.publish(
      "HEALTH_CHECK_RESPONSES",
      JSON.stringify(parsedResponses)
    );
    console.log("👌 Published : ", published);
  },
  {
    connection,
  }
);

worker.on("completed", () => {
  console.log("Im free now.");
});
