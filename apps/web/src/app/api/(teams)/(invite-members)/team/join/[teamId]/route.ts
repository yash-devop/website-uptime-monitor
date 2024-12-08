import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { auth } from "@/utils/auth";
import { verify } from "jsonwebtoken";
import { z } from "zod";
import { zodParser } from "@/utils/zodParser";

export interface UserPayloadJWT {
  email: string;
  teamId: string
}

const teamSchema = z.object({
  inviteToken: z.string(),
});

export const POST = async (
  req: NextRequest,
  { params: { teamId } }: { params: { teamId: string } }
) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }
  let data;
  try {
    data = await zodParser(teamSchema, req);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      { status: 403 }
    );
  }

  const { inviteToken } = data;

  const decodedToken = atob(inviteToken);
  console.log("decodedTOken", decodedToken);
  let decodedEmailId;
  try {
    const verified = verify(decodedToken, process.env.INVITE_SECRET!, {
      complete: true,
    }).payload as UserPayloadJWT;
    console.log('verified:',verified);
    const { email } = verified;
    console.log('emailId:' ,email);
    decodedEmailId = email;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired invite token.", code: "INVALID" },
      { status: 401 }
    )
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      AND: {
        inviteToken: decodedToken,
        teamId,
      },
    },
  });

  console.log("Data after decoding: ", decodedEmailId);

  if (!invitation) {
    return NextResponse.json(
      { message: "Invitation not found!", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { email: decodedEmailId },
  });

  if (!user) {
    // return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.json(
      { message: `User with email ${decodedEmailId} not found.` , code: "USER_NOT_FOUND" },
      { status: 307 }
    );
    // return NextResponse.redirect("https://youtube.com", { status: 301 });
  }

  console.log('HELLO');
  console.log('user: ', user);

  // still PENDING ?
  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      { message: "Invitation already accepted", code: "ALREADY_ACCEPTED" },
      { status: 400 }
    );
  }

  // const userInTeam = await prisma.teamMembership.findFirst({
  //   where:{
  //     userId: user.id
  //   },
  //   select:{
  //     team:{
  //       select:{
  //         teamName: true,
  //       }
  //     }
  //   }
  // })

  // if(userInTeam){
  //   return NextResponse.json(
  //     { message: `User is already present in the ${userInTeam.team.teamName}` , code: "ALREADY_PRESENT"},
  //     { status: 400 }
  //   );
  // }


  try {
    await prisma.teamMembership.create({
      data: {
        role: "MEMBER",
        userId: user.id,
        teamId,
      },
    });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    return NextResponse.json({ message: "You successfully joined the team!" , code: "SUCCESS" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to join the team.", error: (error as Error).message, code: "FAILED_TO_JOIN" },
      { status: 500 }
    );
  }
};
