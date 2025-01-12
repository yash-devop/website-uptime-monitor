import { auth } from "@/utils/auth";
import { prisma } from "@repo/db";
import { format } from "date-fns";
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
      id: monitorId,
    },
  });
  if (!monitor) {
    return NextResponse.json({ message: "Monitor not found" }, { status: 404 });
  }
  return NextResponse.json(
    { message: "Monitor found", data: monitor },
    { status: 200 }
  );
};
