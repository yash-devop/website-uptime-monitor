import { HealthCheckQueue } from "@/queues";
import { auth } from "@/utils/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ monitorId: string; teamId: string }> }
) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  const { monitorId, teamId } = await params;

  console.log("DELETE API ", monitorId, teamId);

  try {
    const monitor = await prisma.monitor.findUnique({
      where: {
        id: monitorId,
        teamId,
      },
    });

    if (!monitor) {
      return NextResponse.json(
        {
          message: `No monitor found.`,
        },
        {
          status: 404,
        }
      );
    }

    const deletedMonitor = await prisma.monitor.delete({
      where: {
        id: monitorId,
        teamId,
      },
    });
    const repeatableJobId = `HealthCheckJob-repeat-${monitor.id}`;
    const jobDeleted = await HealthCheckQueue.removeJobScheduler(repeatableJobId);
    return NextResponse.json(
      {
        message: "Monitor Deleted successfully",
        data: {
          monitorName: deletedMonitor.urlAlias || deletedMonitor.url,
          isJobDeleted: jobDeleted
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(`❌ Error: `, error);
    return NextResponse.json(
      {
        message: `Error while deleting monitor`,
        error,
      },
      {
        status: 500,
      }
    );
  }
};
