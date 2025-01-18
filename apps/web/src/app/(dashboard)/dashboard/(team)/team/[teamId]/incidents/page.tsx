import DisplayRow, {
  DisplayLeftElement,
  DisplayRightElement,
  DisplayRowLeftSection,
  DisplayRowRightSection,
  Dot,
  IconGenerator,
} from "@/app/components/DisplayRow";
import { prisma } from "@repo/db";
import { Ellipsis } from "lucide-react";
import { headers } from "next/headers";
import {formatDistance} from "date-fns"

export default async function IncidentPage({
  params,
}: {
  params: Promise<{
    teamId: string;
  }>;
}) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const { teamId } = await params;

  console.log("Path in Page : ", pathname);

  const incidents = await prisma.incident.findMany({
    where: {
      teamId,
    },
  });
  console.log("incidents", incidents);
  return (
    <>
      <p>
        {" "}
        I am Incident page with path: {pathname} and teamId: {teamId}{" "}
      </p>
      <div className="flex flex-col gap-4 pt-8 overflow-x-auto w-full bg-bslack-4">
        {/* Wrap the rows in a container */}
        <div className="flex flex-col min-w-max">
          {incidents.length > 0 ? (
            incidents.map(({ id, incidentName, incidentStatus, incidentCause , createdAt },idx) => (
                <>
                  <DisplayRow
                    idx={idx}
                    monitorId={id}
                    pathname={pathname!}
                    length={incidents.length}
                    className="py-3.5 px-0"
                  >
                    <DisplayRowLeftSection className="gap-4">
                      <DisplayLeftElement>
                        <IconGenerator
                          iconType="fancy"
                          color={`${incidentStatus === "ongoing" ? "text-red-400 bg-red-400/25" : incidentStatus === "validating" ? "text-yellow-400 bg-yellow-400/25" : incidentStatus === "resolved" ? "text-green-400 bg-green-400/25" : "text-gray-400 bg-gray-400/25"}`}
                        />
                      </DisplayLeftElement>
                      <DisplayLeftElement>
                        <div className="flex flex-col">
                          <h2 className="text-sm">{incidentName}</h2>
                          <p className="text-neutral-3 text-xs">
                            <span className={`${incidentStatus === "ongoing" ? "text-red-400" : incidentStatus === "validating" ? "text-yellow-400" : incidentStatus === "resolved" ? "text-green-400" : "text-gray-400"}`}>
                              {incidentCause}
                            </span>
                          </p>
                        </div>
                      </DisplayLeftElement>
                    </DisplayRowLeftSection>

                    <DisplayRowRightSection className="gap-x-10">
                      <DisplayRightElement>
                        <div className="text-sm text-neutral-3 flex items-center gap-1 w-fit">
                          <p>Started</p>
                          <p>{formatDistance(new Date(createdAt),new Date(),{ addSuffix: true })}</p>
                        </div>
                      </DisplayRightElement>
                      <DisplayRightElement>
                        <div className="text-sm text-neutral-3 flex items-center gap-2 w-fit">
                          <Dot className={`${incidentStatus === "ongoing" ? "bg-red-500" : incidentStatus === "validating" ? "bg-yellow-500" : incidentStatus === "resolved" ? "bg-green-500" : "bg-gray-500"} size-2`}/>
                          <p className="capitalize">{incidentStatus}</p>
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
                </>
              )
            )
          ) : (
            <div className="text-neutral-5 w-full flex items-center pt-12 justify-center">
              <p>Ahhh... No monitors found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
