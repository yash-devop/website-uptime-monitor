import { io, type Socket } from "socket.io-client";

let socket: Socket;

const WEBSOCKET_URL = "http://localhost:3003"

export function getSocket(query?:Record<string,any>): Socket {
  if (socket) {
    return socket;
  }

  socket = io(WEBSOCKET_URL as string, {
    autoConnect: true,
    query
  });
  return socket;
}
