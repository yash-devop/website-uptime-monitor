"use client";

import { getSocket } from "@/lib/socket/socket";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Chart } from "./Charts";

export default function ClientSideMetrics() {
  const { monitorId } = useParams();
  const socket = useMemo(() => {
    const socket = getSocket({ monitorId });
    return socket.connect();
  }, []);

  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("Socket ID is conencted: ", socket.id); // Set the socket ID when the connection is established
    //   setSocketId(socket.id!);
    // });
    socket.on(`monitor-${monitorId}`, (data) => {
      console.log("data", data);
    });

  }, [socket]);
  return (
    <>
        <div className="">
          {monitorId}  
          <Chart />
        </div>
    </>
  );
}

