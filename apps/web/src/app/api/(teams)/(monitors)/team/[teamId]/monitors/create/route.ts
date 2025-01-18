import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
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
      const repeatableJobId = `HealthCheckJob-repeat-${monitor.id}`;
      try {
        const repeatableJob = await HealthCheckQueue.upsertJobScheduler(repeatableJobId,{
          every: Number(checkFrequency),
          
        },{name: repeatableJobId,data:monitor})
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
