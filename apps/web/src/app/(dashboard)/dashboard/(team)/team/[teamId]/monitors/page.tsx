import DisplayRow, {
  DisplayLeftElement,
  DisplayRightElement,
  DisplayRowLeftSection,
  DisplayRowRightSection,
  IconGenerator,
} from "@/app/components/DisplayRow";
import { Button } from "@/app/components/ui/button";
import { auth } from "@/utils/auth";
import { prisma } from "@repo/db";
import { CircleDashed, CircleDot, Ellipsis } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function MonitorPage({
  params,
}: {
  params: Promise<{
    teamId: string;
  }>;
}) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const session = await auth();
  const { teamId } = await params;
  console.log("Path in Page : ", pathname);

  const monitors = await prisma.monitor.findMany({
    where: {
      teamId,
    },
    include: {
      CheckLog: {
        orderBy: {
          isUp: "asc",
        },
        take: 1,
      },
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center w-full justify-between gap-4">
          <p className="text-2xl capitalize"> Hello , {session?.user?.name} </p>
          <Button size={"sm"} className="">
            <Link href={`${pathname}/create`}>Create monitor</Link>
          </Button>
        </div>
        {/* Add the horizontal scrolling to this div */}
        <div className="flex flex-col gap-4 pt-8 overflow-x-auto w-full bg-bslack-4">
          {/* Wrap the rows in a container */}
          <div className="flex flex-col min-w-max">
            {monitors.length > 0 ? (
              monitors.map(({ urlAlias, id, CheckLog }, idx) => (
                // TODO: add isUp or monitorUp or down so to give color to the DisplayRow's Dot / fancy icon
                <DisplayRow idx={idx} monitorId={id} pathname={pathname!} length={monitors.length}>
                  <DisplayRowLeftSection className="gap-9">
                    <DisplayLeftElement>
                      <IconGenerator
                        iconType={CheckLog.length > 0 ? "dot" : "dot"}
                        heartBeatType={"once"}
                        className={CheckLog.length > 0 ? (CheckLog[0].webStatus === "down" ? "bg-red-400 text-red-400" : "") : "bg-neutral-5 text-neutral-5" }
                      />
                    </DisplayLeftElement>
                    <DisplayLeftElement>
                      <div className="flex flex-col">
                        <h2 className="text-sm">{"name"}</h2>
                        <p className="text-neutral-3 text-xs">
                          <span className="text-red-400">Down </span>2 days ago
                        </p>
                      </div>
                    </DisplayLeftElement>
                  </DisplayRowLeftSection>

                  <DisplayRowRightSection className="gap-x-10">
                    <DisplayRightElement>
                      <div className="text-sm text-neutral-3 flex items-center gap-2 w-fit">
                        <CircleDot size={16} className="text-neutral-4" />
                        <p>Checking every {"3m"}</p>
                      </div>
                    </DisplayRightElement>
                    <DisplayRightElement>
                      <div className="pr-4">
                        <div className="hover:bg-neutral-6/50 p-1 rounded-md cursor-pointer">
                          <Ellipsis size={17} className="text-neutral-4" />
                        </div>
                      </div>
                    </DisplayRightElement>
                    
                  </DisplayRowRightSection>
                </DisplayRow>
              ))
            ) : (
              <div className="text-neutral-5 w-full flex items-center pt-12 justify-center">
                <p>Ahhh... No monitors found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
