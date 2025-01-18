// import { Server } from "socket.io";
// import express from "express";
// import { createClient } from "redis";
// import { calculateDuration } from "./utils";
// import { prisma } from "@repo/db";
// const createRedisClient = () => {
//   if (process.env.NODE_ENV === "production") {
//     return createClient({ url: process.env.UPSTASH_REDIS_URL });
//   }
//   return createClient();
// };

// const client = createRedisClient();
// client.connect().catch((err) => {
//   console.log("Failed to connect to redis: ", err);
// });
// const app = express();
// // app.use(cors({
// //   origin: ["http://localhost:3000","http://localhost:3003"],
// //   methods: ["GET", "POST","DELETE"]

// // }))
// const PORT = 3003;

// const expressServer = app.listen(PORT, () => {
//   console.log("Websocket server is running on port", PORT);
// });

// const webSocketServer = new Server(expressServer, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:3003"],
//     methods: ["GET", "POST", "DELETE"],
//   },
// }); // or io

// const activeSubscriptions = new Map();

// webSocketServer.on("connection", async (socket) => {
//   console.log("Client connected");

//   const monitorId = socket.handshake.query.monitorId as string;
//   console.log("Monitor ID:", monitorId);

//   // Subscribe to monitor updates from Redis
//   client.subscribe(`HealthCheckJob-${monitorId}`, async (message) => {
//     try {
//       console.log('message',message);
//       const parsedMessage = JSON.parse(message); // Example: { status: "up" }
//       const latestCheckLog = await prisma.checkLog.findFirst({
//         where: { monitorId },
//         orderBy: { createdAt: "desc" },
//       });

//       if (!latestCheckLog) {
//         console.log("No check log found for this monitor.");
//         return;
//       }

//       // Determine duration and create update payload
//       let duration = "";
//       if (latestCheckLog.webStatus === "up" && latestCheckLog.up_at) {
//         duration = calculateDuration(latestCheckLog.up_at.toISOString());
//       } else if (
//         latestCheckLog.webStatus === "down" &&
//         latestCheckLog.down_at
//       ) {
//         duration = calculateDuration(latestCheckLog.down_at.toISOString());
//       }

//       const update = {
//         status: latestCheckLog.webStatus,
//         duration,
//         region: latestCheckLog.region,
//       };

//       // Emit update to the client
//       socket.emit(`monitor-${monitorId}`, update);
//     } catch (err) {
//       console.error("Error processing Redis message:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });
