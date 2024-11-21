import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma";
import { auth } from "@/utils/auth";
import {} from "nodemailer";
import { generateAuthToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";
import InvitationEmail from "@/emails/InvitationEmail";

const emailSchema = z.object({
  emailId: z.string().email({
    message: "Email is not valid brother.",
  }),
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

  const body = await req.json().catch(() => null); // Catch parsing errors
  if (!body || !body.emailId) {
    return NextResponse.json({
      message: "Please add email id.",
    });
  }

  const { emailId }:{
    emailId: string
  } = body;

  const { success, error } = emailSchema.safeParse({
    emailId,
    teamId,
  });

  if (!success) {
    const errors = error.errors.map((err)=>({
       error: err.message
    }));
    
    return NextResponse.json(
      {
        message: errors,
      },
      {
        status: 406,
      }
    );
  }

  // create a invite-token
  const inviteToken = generateAuthToken({
    payload: {
      emailId,
    },
    secret: process.env.INVITE_SECRET!,
    TTL: "120000",   // 120000ms means 2min.
  });

  console.log("Token is :", inviteToken);

  // store this token in db for verification.

  try {
    const invitation = await prisma.invitation.create({
      data: {
        inviteTo: emailId,
        inviteToken,
        teamId,
        inviterId: String(session.user.id),
        status: "PENDING"
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
        invitedBy: { name, email, image },
        team: { teamName },
      } = invitation;

      const REDIRECT_JOIN_URL = `${BASE_URL}/join?token=${btoa(inviteToken)}`;
      await sendEmail({
        from: "controlweb.dev@gmail.com",
        html: await render(
          InvitationEmail({
            url: REDIRECT_JOIN_URL,
            inviterImage: image!,
            teamName: teamName,
            inviterEmail: String(session.user.email),
          })
        ),
        subject: `${
          name!.charAt(0).toUpperCase() + name!.substring(1)
        } has invited you to join ${teamName}`,
        to: emailId,
      });
    }

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
