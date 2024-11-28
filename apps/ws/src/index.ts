import WebSocket, { WebSocketServer } from "ws";
import redis, { createClient, RedisClientType } from "redis";

const wss = new WebSocketServer({ port: 3003 });

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

console.log("WORKING");
const clients: Record<number, WebSocket> = {};
wss.on("connection", async(ws) => {
  const userId = Math.random() * 1000;
  console.log(`Received a new connection.`);
  clients[userId] = ws;
  console.log(`${userId} connected.`);
//   ws.on("message", (data) => {
//     console.log("Data is: ", data.toString("utf-8"));
//   });

//   ws.on("test", (data) => {
//     console.log("TEST DATA: ", data);
//   });
  const data = await client.subscribe("HEALTH_CHECK_RESPONSES",(response)=>{
      ws.send(response);
  })
});
