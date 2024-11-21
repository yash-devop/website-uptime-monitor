import { auth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,{
    params:{
      teamId
    }
  }:{
    params: {
      teamId: string
    }
  }
) => {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  console.log('teamId: ', teamId);
  const monitors = await prisma.monitor.findMany({
     where:{
        teamId
     }
  });

  return NextResponse.json({
    data: monitors
  })
};
