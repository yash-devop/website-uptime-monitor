import { NextRequest, NextResponse } from "next/server";
import { prisma }from "@repo/db";
import { auth } from "@/utils/auth";
import { verify } from "jsonwebtoken";

export interface UserPayloadJWT {
  emailId: string;
}

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

  const body = await req.json().catch(() => null);
  if (!body || !body.inviteToken) {
    return NextResponse.json(
      { message: "Please provide an invite token." },
      { status: 400 }
    );
  }

  const { inviteToken } = body;

  const decodedToken = atob(inviteToken);
  console.log('decodedTOken', decodedToken);
  let decodedEmailId;
  try {
    const verified = verify(decodedToken, process.env.INVITE_SECRET!, {
      complete: true,
    }).payload as UserPayloadJWT;
    const { emailId } = verified;
    decodedEmailId = emailId;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired invite token." },
      { status: 401 }
    );
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      AND:{
        inviteToken: decodedToken,
        teamId,
      }
    },
  });

  console.log('invitation: ', invitation);

  if (!invitation) {
    return NextResponse.json(
      { message: "Invitation not found!" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { email: decodedEmailId },
  });

  if (!user) {
    // return NextResponse.json(
    //   { message: `User with email ${decodedEmailId} not found.` },
    //   { status: 404 }
    // );
    return NextResponse.redirect("https://youtube.com",{status: 301})
  }

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

    return NextResponse.json({ message: "You successfully joined the team!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to join the team.", error: (error as Error).message },
      { status: 500 }
    );
  }
};
