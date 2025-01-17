import {Server} from "socket.io"
import express from "express"
import cors from "cors"
import redis, { createClient, RedisClientType } from "redis";
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
const app = express()
// app.use(cors({
//   origin: ["http://localhost:3000","http://localhost:3003"],
//   methods: ["GET", "POST","DELETE"]

// }))
const PORT=3003

const expressServer =  app.listen(PORT,()=>{
  console.log('Websocket server is running on port', PORT);
})


const webSocketServer = new Server(expressServer,{
  cors: {
    origin: ["http://localhost:3000","http://localhost:3003"],
    methods: ["GET", "POST","DELETE"]
  }
});     // or io




// 1. Add event listeners on the socker server 

webSocketServer.on("connection",async(socket)=>{
  console.log('Conencted');
  // let checkFrequency = 3000;
  // let count = 0
  // const timer = setInterval(()=>{
  //   count++;
  //   socket.emit("hello", count);

  //   if(count*1000 >= checkFrequency){
  //     clearInterval(timer)
  //     socket.emit("hello","KHATAM HUA BHAI")
  //   }
  // },1000)
  
  const monitorId = socket.handshake.query.monitorId
  console.log('monitorId',monitorId);
  await client.subscribe(`HealthCheckJob-${monitorId}`,(response)=>{
      socket.emit(`monitor-${monitorId}`,response)
  })
  // socket.emit(`monitor-${socket.handshake.query}`,)

  // You can listen for further events if needed
  socket.on("client-message", (data) => {
    console.log("Received message from client:", data);
  });
})

// console.log('http://localhost:3003');








// import WebSocket, { WebSocketServer } from "ws";
// import redis, { createClient, RedisClientType } from "redis";

// const wss = new WebSocketServer({ port: 3003 });

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

// console.log("WORKING");
// const clients: Record<number, WebSocket> = {};
// wss.on("connection", async(ws) => {
//   const userId = Math.random() * 1000;
//   console.log(`Received a new connection.`);
//   clients[userId] = ws;
//   console.log(`${userId} connected.`);
// //   ws.on("message", (data) => {
// //     console.log("Data is: ", data.toString("utf-8"));
// //   });

// //   ws.on("test", (data) => {
// //     console.log("TEST DATA: ", data);
// //   });
//   const data = await client.subscribe("HEALTH_CHECK_RESPONSES",(response)=>{
//       ws.send(response);
//   })
// });
