import { IconGenerator } from "@/app/components/DisplayRow";
import { LucideProps, Settings, ShieldAlert, Trash2 } from "lucide-react";
import { prisma } from "@repo/db";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MonitorCTA } from "./QuickCTA";

export default async function MonitorIDPage({
  params,
}: {
  params: Promise<{
    monitorId: string;
    teamId: string;
  }>;
}) {
  const { monitorId , teamId } = await params;
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
          monitorId
        }
      }
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
  if (!lastChecked) {
    console.log("No checks found for this monitor.");
    return;
  }
  const duration = intervalToDuration({
    start: 0,
    end: Number(monitor?.checkFrequency),
  });
  const lastCheckedDate = new Date(lastChecked.createdAt);
  const timeAgo = formatDistanceToNow(lastCheckedDate, { addSuffix: true });

  console.log(`Last checked: ${timeAgo}`);
  return (
    <>
      <p className="pb-4">Monitor id is {monitorId}</p>
      <div className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-6">
            <IconGenerator
              iconType="dot"
              heartBeatType="infinite"
              className={`${monitor?.status === "down" ? "bg-red-400" : "bg-green-400"}`}
            />
            <div>
              <h1 className="text-xl font-semibold">{monitor?.urlAlias}</h1>
              <p
                className={`${monitor?.status === "down" ? "text-red-400" : "text-green-400"} text-sm`}
              >
                {monitor?.status ?? "unavailable"}
                <span className="text-neutral-4">
                  {" "}
                  · {`Checked every ${formatDuration(duration)}`}
                </span>
              </p>
            </div>
          </div>
        </div>
        <MonitorCTA />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatusCard name="Currently up for" status={"---"} />
          <StatusCard name="Last checked" status={timeAgo ?? "---"} />
          <StatusCard
            name="Incidents"
            status={monitor?._count.Incident.toString() ?? "0"}
          />
        </div>
        {/* <ClientSideMetrics /> */}
      </div>
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
