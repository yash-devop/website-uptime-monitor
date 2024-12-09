import { Button } from "@/app/components/ui/button";
import { auth } from "@/utils/auth";
import { CircleDashed, CircleDot, Ellipsis } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function MonitorPage({
  params,
}: {
  params: {
    teamId: string;
  };
}) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const session = await auth();
  console.log("Path in Page : ", pathname);

  const arr = [
    {
      name: "httpstat.us",
    },
    {
      name: "httpstat.us",
    },
  ];

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center w-full justify-between">
          <p className="text-2xl capitalize"> Hello , {session?.user?.name} </p>
          <Button size={"sm"}>
            <Link href={`${pathname}/create`}>Create monitor</Link>
          </Button>
        </div>
        {/* Add the horizontal scrolling to this div */}
        <div className="flex flex-col gap-4 pt-8 overflow-x-auto w-full bg-bslack-4">
          {/* Wrap the rows in a container */}
          <div className="flex flex-col min-w-max">
            {arr.map(({ name }, idx) => (
              <MonitorRow idx={idx} name={name} length={arr.length} pathname={pathname!}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MonitorRow({
  idx,
  name,
  length,
  pathname
}: {
  idx: number;
  name: string;
  length: number;
  pathname: string
}) {
  return (
    <>
        <Link href={`${pathname}/create`}>
            <div
            className={`flex justify-between items-center py-3 gap-4 bg-neutral-7/40 border-sidebar-border/60 p-2 overflow-x-auto w-full hover:bg-neutral-7/90 transition-all ${
                length === 0
                ? "border rounded-lg "
                : idx === 0
                    ? length > 1
                    ? "border border-b-0 rounded-t-lg rounded-tr-lg rounded-tl-lg"
                    : "border rounded-lg"
                    : idx === length - 1
                    ? "border rounded-br-lg rounded-bl-lg "
                    : "border-l border-r border-t "
            } `}
            >
            <div className="pl-4 pr-2">
                <div className="size-3 bg-green-1 rounded-full duration-[4000]" />
            </div>
            <div className="grow flex items-center justify-between pr-5 lg:pr-16">
                <div className="grow">
                    <h2 className="text-sm">httpstat.us</h2>
                    <p className="text-neutral-3 text-xs">
                        <span className="text-red-400">Down </span>2 days ago
                    </p>
                </div>
                <div className="text-sm text-neutral-3 flex items-center gap-1">
                    <CircleDot size={16} className="text-neutral-4"/>
                    <p>3m</p>
                </div>
            </div>
            <div className="pr-4">
                <div className="hover:bg-neutral-6/50 p-1 rounded-md cursor-pointer">
                        <Ellipsis size={17} className="text-neutral-4" />
                </div>
            </div>
            </div>
        </Link>
    </>
  );
}
