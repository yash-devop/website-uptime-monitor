import { BullQueue } from "@/lib/bullmq-queue/queue.server";

export const HealthCheckQueue = BullQueue({
  queueName: "HealthCheckQueue",
  connection: {
    disconnectTimeout: 500,
    commandTimeout: 500,
    url: process.env.UPSTASH_REDIS_REST_URL,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
    port: 6379
  },
});