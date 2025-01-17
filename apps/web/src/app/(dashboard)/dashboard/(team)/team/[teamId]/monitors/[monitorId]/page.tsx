import { IconGenerator } from "@/app/components/DisplayRow";
import { prisma } from "@repo/db";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import React from "react";
import Link from "next/link";
import { MonitorCTA } from "./QuickCTA";
import ClientSideMetrics from "./ClientSideMetrics";

export default async function MonitorIDPage({
  params,
}: {
  params: Promise<{
    monitorId: string;
    teamId: string;
  }>;
}) {
  const { monitorId } = await params;
  const monitor = await prisma.monitor.findFirst({
    where: {
      id: monitorId,
    },
    include: {
      _count: {
        select: {
          Incident: true,
        },
      },
      Incident: {
        where: {
          monitorId,
        },
      },
    },
  });
  console.log("monitor", monitor);

  const lastChecked = await prisma.checkLog.findFirst({
    where: {
      monitorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });
  const timeAgo = lastChecked ? formatDistanceToNow(new Date(lastChecked.createdAt), { addSuffix: true }) : "No checks performed yet.";
  const checkFrequency = Number(monitor?.checkFrequency || 0);
  const duration = checkFrequency > 0 ? intervalToDuration({ start: 0, end: checkFrequency }): null;

  console.log(`Last checked: ${timeAgo}`);
  return (
    <>
      {monitor ? (
        <div className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-6">
              <IconGenerator
                iconType="dot"
                heartBeatType="infinite"
                className={`${monitor?.status === "down" ? "bg-red-400" : monitor.status ==="up" ? "bg-green-400": "bg-neutral-5"}`}
              />
              <div>
                <h1 className="text-xl font-semibold">{monitor.urlAlias}</h1>
                <p
                  className={`${monitor?.status === "down" ? "text-red-400" : monitor.status ==="up" ? "text-green-400": "text-neutral-4"} text-sm`}
                >
                  {monitor?.status ?? "Calculating"}
                  <span className="text-neutral-4">
                    {" "}
                    ·{" "}
                    {duration ? `Checked every ${formatDuration(duration)}` : "Check frequency not set"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <MonitorCTA />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatusCard name="Currently up for" status={"---"} />
            <StatusCard
              name="Last checked"
              status={timeAgo ?? "No checks have been performed yet."}
            />
            <StatusCard
              name="Incidents"
              status={monitor?._count.Incident.toString() ?? "0"}
            />
          </div>
          <ClientSideMetrics />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-semibold text-red-500">
              Monitor Not Found
            </h1>
            <p className="text-gray-500">
              The requested monitor does not exist or could not be retrieved.
            </p>
            <Link href="/monitors" className="mt-4 text-blue-500 underline">
              Go back to Monitors
            </Link>
          </div>
        </>
      )}
    </>
  );
}

const StatusCard = ({ name, status }: { name: string; status: string }) => {
  return (
    <>
      <div className="bg-neutral-7 border border-neutral-6 rounded-lg min-h-[90px] flex flex-col gap-1.5 p-6">
        <span className="text-sm text-neutral-3">{name}</span>
        <span className="text-2xl">{status}</span>
      </div>
    </>
  );
};
