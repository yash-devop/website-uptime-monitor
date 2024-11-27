import { auth } from "@/utils/auth";
import {prisma} from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest,res:NextResponse) => {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  try {
    const teams = await prisma.teamMembership.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (!teams) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
    return NextResponse.json({ exist: true, teams }, { status: 200 });
  } catch (error) {
    console.error("Error in checkTeam API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
