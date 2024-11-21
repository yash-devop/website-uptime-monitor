import { BullQueue } from "@/lib/bullmq-queue/queue.server";

export const HealthCheckQueue = BullQueue({
  queueName: "HealthCheckQueue",
  connection: {
    disconnectTimeout: 500,
    commandTimeout: 500
  },
});