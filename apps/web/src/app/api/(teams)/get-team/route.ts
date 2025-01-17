import { auth } from "@/utils/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();
  if (!session || !session?.user) {
    return NextResponse.json(
      {
        message: "Unauthorized access. Please Login",
      },
      {
        status: 401,
      }
    );
  }

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId: session?.user?.id },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      invitations:{
        where:{
          status: "PENDING"
        },
        select:{
          inviterId: true,
          invitedBy: {
            select:{
              name: true,
              email: true,
              image: true
            }
          },
          inviteTo: true,
          status: true
        }
      }
    },
  });
  // const teams = await prisma.team.findMany({
  //   where: {
  //     members: {
  //       some: { userId : session.user.id },
  //     },
  //   },
  //   include: {
  //     members: {
  //       include: {
  //         user: true,
  //       },
  //     },
  //   },
  // });
  return NextResponse.json({
    data: teams,
  });
};
