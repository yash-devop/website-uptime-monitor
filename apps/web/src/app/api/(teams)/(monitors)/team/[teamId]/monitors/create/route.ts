import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { CheckFrequencyType, type MonitorType } from "@repo/common";
import { monitorSchema } from "@repo/common";
import { zodParser } from "@/utils/zodParser";
import { prisma } from "@repo/db";
import { HealthCheckQueue } from "@/queues";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  let data;
  try {
    data = await zodParser(monitorSchema, req);
    // console.log("data", data);
  } catch (error) {
    return NextResponse.json({
      error,
    },{status: 403});
  }

  const {
    teamId,
    url,
    alertUsing,
    alertWhen,
    checkFrequency,
    recoveryPeriod,
    confirmationPeriod,
    urlAlias,
    httpRequestTimeout,
    headerName,
    headerValue,
    httpMethods,
    httpRequestBody,
    regions,
  } = data;
  // create a monitor:

  try {
    const monitor = await prisma.monitor.create({
      data: {
        url,
        alertUsing,
        checkFrequency,
        confirmationPeriod,
        httpRequestTimeout,
        recoveryPeriod,
        urlAlias,
        alertWhen,
        headerName,
        headerValue,
        httpMethods,
        httpRequestBody,
        regions,
        teamId,
      },
    });

    console.log('Monitor created: ', monitor);

    if (monitor) {
      const jobId = `HealthCheckJob-${monitor.id}`;
      try {
        const immediateJob = await HealthCheckQueue.add(jobId, monitor, {     // created to executed that monitor ASAP.
          delay: 0,
          jobId,     
        });
        const repeatableJob = await HealthCheckQueue.add(jobId, monitor, {  // then add repeatable checkFrequencies.
          repeat: {
            every: Number(checkFrequency),
          },
          jobId,    // if something went wrong related to the ids , then note that here we overide the default id... revert back if need ( it will then give ids like => repeat:id)
        });
  
        // HealthCheckQueue.getJobs([""])
        console.log('immediateJob',immediateJob);
        console.log(
          `✅Monitor ${monitor.urlAlias} is added to the queue with immediateJob id of ${immediateJob.id} and Repeatablejob id: ${repeatableJob.id}`
        );
        
      } catch (error) {
        console.log('error while creating Monitor Job', error);
      }
    }

    return NextResponse.json({
      message: `${monitor.urlAlias} Monitor created !`,
    },{
      status: 200
    });
  } catch (error) {
    console.log(`❌ Error: `, error);
    return NextResponse.json({
      message: `Error while creating monitor`,
      error,
    },{
      status: 500
    });
  }
};
