import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { CheckFrequencyType, type MonitorType } from "@repo/common/types";
import { monitorSchema } from "@repo/common/schemas";
import { zodParser } from "@/utils/zodParser";
import prisma from "@repo/db/prisma";
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
    });
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
    regions
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
          teamId
      },
    });
  
    if(monitor){
      const jobId = `HealthCheckJob-${monitor.id}`
      const queueResult = await HealthCheckQueue.add(jobId, monitor, {
         repeat: {
            every: Number(checkFrequency)
         },
         jobId
      });

      // HealthCheckQueue.getJobs([""])
  
      console.log(`✅Monitor ${monitor.urlAlias} is added to the queue with job id: ${queueResult.id}`);
    }
  
    return NextResponse.json({
       message: `${monitor.urlAlias} Monitor created !`
    })
  } catch (error) {
    console.log(`❌ Error: `, error);
    return NextResponse.json({
      message: `Error while creating monitor`,
      error
   })
     
  }
  
};
