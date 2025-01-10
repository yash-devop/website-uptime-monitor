import { IconGenerator } from "@/app/components/DisplayRow";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Globe, Trash2 } from "lucide-react";
import ClientSideTabs from "./ClientSideTabs";
import { Metadata, ResolvingMetadata } from "next";


// 1. Static Metadata
// export const metadata:Metadata = {

// }

// 2. Dynamic metadata
// export async function generateMetadata(
//     parent: ResolvingMetadata
//   ): Promise<Metadata> {
//     const value = Math.random()
//     return {
//       title: value.toString(),
//       icons: {
//         icon: { url: "https://m.youtube.com/static/logos/favicon.ico" }
//       },
//     }
// }
export default async function MonitorIDPage() {
  return (
    <>
      <div className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconGenerator
              iconType="fancy"
              color="size-12 rounded-lg"
              iconSize="size-7"
            />
            <div>
              <h1 className="text-2xl font-semibold">httpstat.us/495</h1>
              <p className="text-red-400">
                Ongoing
                <span className="text-neutral-4">
                  {" "}
                  · {"4 Jan 2025 at 10:08am IST"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Button className="bg-neutral-5 border-none hover:bg-neutral-6 font-semibold">
              Escalate
            </Button>
            <Button>Acknowledge</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4">
              <Globe size={18} />
              <span className="text-balance">Monitor</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4">
              <Trash2 size={18} />
              <span className="text-balance">Remove</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={"secondary"}
              className="bg-neutral-6 hover:bg-neutral-6 text-neutral-3 flex items-center gap-1 truncate px-3"
            >
              Acknowledged by
              <div className="flex items-center gap-1">
                <img
                  src="https://pbs.twimg.com/profile_images/77846223/profile_400x400.jpg"
                  className="size-5 rounded-full"
                />
                <span className="truncate">Yash Kamble</span>
              </div>
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatusCard name="Cause" status="Status 495" />
          <StatusCard name="Started" status="27 minutes ago" />
          <StatusCard name="Length" status="Acknowledged" />
        </div>
        <div className=" bg-neutral-7  border border-neutral-6 rounded-lg overflow-hidden">
          <div className="px-6 py-5 min-h-[50px] flex flex-col gap-2">
            <span className="text-neutral-3 text-sm">Checked URL</span>
            <span className="text-sm tracking-wide font-light text-white">
              GET {`https://httpstat.us/495`}
            </span>
          </div>
          <div className="px-6 py-5 bg-neutral-800 flex flex-col gap-2">
            <span className="text-neutral-3 text-sm">Escalation</span>
            <span className="text-white">Entire Team</span>
          </div>
        </div>
        <ClientSideTabs />
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
