import { auth } from "@/utils/auth";
import prisma from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params: { monitorId },
  }: {
    params: {
      monitorId: string;
    };
  }
) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  const monitor = await prisma.monitor.findUnique({
     where: {
        id: monitorId
     }
  });

  return NextResponse.json({
    data: monitor
  })
};

