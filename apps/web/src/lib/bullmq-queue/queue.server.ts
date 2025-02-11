import { ConnectionOptions, Queue } from "bullmq";

type BullQueueType = {
  queueName: string;
  connection: ConnectionOptions;
};

export function BullQueue<T, K>({
  queueName,
  connection = {
    host: process.env.UPSTASH_REDIS_REST_URL,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
    port: 6379,
  }
}: BullQueueType): Queue<T, K> {
  try {
    const queue = new Queue<T, K>(queueName, {
      connection,
    });
    return queue;
  } catch (error) {
    throw error;
  }
}


/**
 * When connection is not established with the redis , it continuously throws connrefused error for 10s. ( TODO : fix it ) 
 */