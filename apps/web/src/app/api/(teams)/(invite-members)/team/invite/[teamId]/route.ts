import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/db";
import { auth } from "@/utils/auth";
import { generateAuthToken } from "@/lib/token";
import { sendEmail } from "@repo/emails";
import { render } from "@react-email/render";
import {InvitationEmail} from "@repo/emails";
import { zodParser } from "@/utils/zodParser";

const emailSchema = z.object({
  emailIds: z.array(
    z.string().email({
      message: "Email is not valid brother.",
    })
  ),
  teamId: z.string().cuid({
    message: "Please enter a valid team-id.",
  }),
});

export const POST = async (
  req: NextRequest,
  {
    params: { teamId },
  }: {
    params: {
      teamId: string;
    };
  }
) => {
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://controluptime.yashstack.com"
      : "http://localhost:3000";
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

  let data;
  try {
    data = await zodParser(emailSchema, req);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      { status: 403 }
    );
  }

  const { emailIds } = data;

  try {
    emailIds.forEach(async (email) => {
      // create a invite-token
      console.log('emailIds: ', email);
      const inviteToken = generateAuthToken({
        payload: {
          email,
          teamId
        },
        secret: process.env.INVITE_SECRET!,
        TTL: (1000*60*10).toString(), // 120000ms means 2min.
      });

      console.log("Token is :", inviteToken);

      // store this token in db for verification.
      const invitation = await prisma.invitation.create({
        data: {
          inviteTo: email,
          inviteToken,
          teamId,
          inviterId: String(session?.user?.id),
          status: "PENDING",
        },
        select: {
          invitedBy: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          team: true,
        },
      });
      console.log('invitation: ', invitation);

      if (invitation) {
        const {
          invitedBy: { name, image },
          team: { teamName },
        } = invitation;

        const REDIRECT_JOIN_URL = `${BASE_URL}/join/${teamId}?token=${btoa(inviteToken)}`;
        await sendEmail({
          from: "controlweb.dev@gmail.com",
          html: await render(
            InvitationEmail({
              url: REDIRECT_JOIN_URL,
              inviterImage: image!,
              teamName: teamName,
              inviterEmail: String(session?.user?.email),
            })
          ),
          subject: `${
            name!.charAt(0).toUpperCase() + name!.substring(1)
          } has invited you to join ${teamName}`,
          to: email,
        });
      }
    });

    return NextResponse.json({
      message: "Invitation Sent Successfully !",
    });
  } catch (error) {
    console.log("Error collected :", error);
    return NextResponse.json({
      message: (error as Error).message,
    });
  }
};
