import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { CheckFrequencyType, editMonitorSchema, type MonitorType } from "@repo/common";
import { monitorSchema } from "@repo/common";
import { zodParser } from "@/utils/zodParser";
import { prisma } from "@repo/db";
import { HealthCheckQueue } from "@/queues";

export const PATCH = async (req: NextRequest , { params }: { params: Promise<{ monitorId: string }> }) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  let data;
  try {
    data = await zodParser(editMonitorSchema, req);
  } catch (error) {
    return NextResponse.json({
      error,
    },{status: 403});
  }

  console.log('data',data);
  const {monitorId} = await params;
  // create a monitor:

  try {
    const monitor = await prisma.monitor.findUnique({
      where: {
        id: monitorId
      }
    });

    console.log('Monitor created: ', monitor);

    if(!monitor){
      return NextResponse.json({
        message: `No monitor found.`,
      },{
        status: 404
      });
    }

    // edit monitor

    const updatedMonitor = await prisma.monitor.update({
      where: { id: monitorId },
      data,
    });

    console.log('updatedMonitor',updatedMonitor);
  
    if (monitor) {
      const repeatableJobId = `HealthCheckJob-repeat-${monitor.id}`;
      const repeatableJob = await HealthCheckQueue.upsertJobScheduler(repeatableJobId, {every: Number(updatedMonitor.checkFrequency)} , {data: updatedMonitor})
      
      console.log('new repeatableJob', repeatableJob ?? "job not created bro ");
    }
    return NextResponse.json({
      message: "Monitor updated successfully",
      data: updatedMonitor,
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
