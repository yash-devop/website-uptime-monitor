import { IconGenerator } from "@/app/components/DisplayRow";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import ClientSideTabs from "./ClientSideTabs";
import { Metadata, ResolvingMetadata } from "next";
import { INCIDENT_STATUS, prisma } from "@repo/db";
import Link from "next/link";
import { format } from "date-fns";
import { IncidentCTA } from "./IncidentCTA";

// 1. Static Metadata
// export const metadata:Metadata = {

// }

// 2. Dynamic metadata
// => green icon = ../../../../../../../upfavicon.ico
// => red icon = ../../../../../../../downfavicon.ico
// => testing favicon = "https://m.youtube.com/static/logos/favicon.ico"
export async function generateMetadata(
  {
    params
  }:{
    params: Promise<{
      incidentId: string
    }>,
  }
): Promise<Metadata> {
  const {incidentId} = await params
  const incident = await prisma.incident.findFirst({
    where: {
      id: incidentId,
    },
    include:{
      monitor:{
        select:{
          httpMethods: true
        }
      }
    }
  });
  return {
    title: incident?.url,
    icons: {
      icon: { url: incident?.incidentStatus === "ongoing" ? "../../../../../../../downfavicon.ico" : "../../../../../../../upfavicon.ico" },
    },
  };
}

export default async function MonitorIDPage({
  params,
}: {
  params: Promise<{
    incidentId: string;
    teamId: string;
  }>;
}) {
  const { incidentId } = await params;
  const incident = await prisma.incident.findFirst({
    where: {
      id: incidentId,
    },
    include:{
      monitor:{
        select:{
          httpMethods: true
        }
      }
    }
  });
  console.log("incident", incident);

  const Incident_status: Record<
    INCIDENT_STATUS,
    { value: string }
  > = {
    ongoing: {
      // title: "Started on",
      value: "Ongoing",
    },
    validating: {
      // title: "Validation started on",
      value: "Acknowledged",
    },
    resolved: {
      // title: "Resolved at",
      value: incident?.resolvedAt?.toString() || "---",
    },
  };
  return (
    <>
      {incident ? (
        <div className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconGenerator
                iconType="fancy"
                color="size-11 rounded-lg"
                iconSize="size-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {incident.incidentName}
                </h1>
                <p className="text-red-400 text-sm">
                  {incident.incidentStatus}
                  <span className="text-neutral-4">
                    {" "}
                    · {format(incident.createdAt, "dd MMM yyyy 'at' hh:mm a")}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Button>Acknowledge</Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-6">
            <div className="flex items-center gap-5">
              {/* <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4">
                <Globe size={18} />
                <span className="text-balance">Monitor</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4">
                <Trash2 size={18} />
                <span className="text-balance">Remove</span>
              </div> */}
              <IncidentCTA />
            </div>
            {
              (incident.acknowledgedBy || incident.incidentStatus === "validating") ? (
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={"secondary"}
                      className="bg-neutral-6 hover:bg-neutral-6 text-neutral-3 flex items-center gap-1 truncate px-3"
                    >
                      Acknowledged by
                      <div className="flex items-center gap-1">
                        <span className="truncate">{incident.acknowledgedBy || "Unavailable"}</span>
                      </div>
                    </Badge>
                  </div>
              ) : null
            }
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatusCard name="Cause" status={incident.incidentName} />
            <StatusCard name={"Started"} status="10 Jan 2025 at 10pm" />
            <StatusCard name="Status" status={Incident_status[incident.incidentStatus].value} />
          </div>
          <div className=" bg-neutral-7  border border-neutral-6 rounded-lg overflow-hidden">
            <div className="px-6 py-5 min-h-[50px] flex flex-col gap-2">
              <span className="text-neutral-3 text-sm">Checked URL</span>
              <span className="text-sm tracking-wide font-light text-white">
                {incident.monitor.httpMethods.toUpperCase()} {incident.url}
              </span>
            </div>
            <div className="px-6 py-5 bg-neutral-800 flex flex-col gap-2">
              <span className="text-neutral-3 text-sm">Escalation</span>
              <span className="text-white">Entire Team</span>
            </div>
          </div>
          <ClientSideTabs status={incident.incidentCause} url={incident.url}/>
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
            <Link href="/incidents" className="mt-4 text-blue-500 underline">
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
      <div className="bg-neutral-7 border border-neutral-6 rounded-lg min-h-[80px] flex flex-col gap-1.5 p-6">
        <span className="text-sm text-neutral-3">{name}</span>
        <span className="text-xl">{status}</span>
      </div>
    </>
  );
};
