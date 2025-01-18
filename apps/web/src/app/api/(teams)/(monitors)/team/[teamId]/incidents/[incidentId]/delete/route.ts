import { auth } from "@/utils/auth";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ incidentId: string; teamId: string }> }
) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  const { incidentId, teamId } = await params;

  console.log("DELETE API ", incidentId, teamId);

  try {
    const Incident = await prisma.incident.findUnique({
      where: {
        id: incidentId,
        teamId,
      },
    });

    console.log('incident data =>',Incident);
 
    if (!Incident) {
      return NextResponse.json(
        {
          message: `No Incident found.`,
        },
        {
          status: 404,
        }
      );
    }

    const deletedIncident = await prisma.incident.delete({
      where: {
        id: incidentId,
        teamId,
      },
    });
    return NextResponse.json({
      message: "Incident Deleted successfully",
      data: {
        incidentName: deletedIncident.incidentName,
      },
    },{
        status: 200
    });
  } catch (error) {
    console.log(`❌ Error: `, error);
    return NextResponse.json(
      {
        message: `Error while deleting incident`,
        error,
      },
      {
        status: 500,
      }
    );
  }
};
