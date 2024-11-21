import { createStripeCustomer } from "@/lib/stripe/customer";
import { auth } from "@/utils/auth";
import { getUniqueTeamName } from "@/utils/getUniqueTeamName";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

type Plan = "FREE" | "PRO";

type Team = {
  teamName: string;
  email: string;
};

const teamSchema = z.object({
  email: z.string({
    message: "Email is required"
  }).email({
    message: "Email is not valid brother.",
  }),
  teamName: z.string({
    message: "Team name is required"
  })
});

export const POST = async (req: NextRequest,res:NextResponse) => {
  const session = await auth();
  console.log('Session:', session);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized access. Please Login" },
      { status: 401 }
    );
  }

  const { teamName, email }: Team = await req.json(); 

  // const teamName = getUniqueTeamName();
  try {
    const data = teamSchema.parse({
       email,
       teamName
    })
  } catch (error) {
    if(error instanceof ZodError){
       const messages = error.issues.map((issue)=>{
          return {
             path: issue.path.join("."),
             message: issue.message,
          }
       })
       return NextResponse.json({
          message: messages
       },{
          status: 406
       })
    }
  }
  let team;
  try {
    team = await prisma.team.create({
      data: {
        plan: "FREE",
        teamName,
        members: {
          create: {
            role: "OWNER",
            userId: String(session.user.id),
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          message: error.message,
          metaData: error.meta,
          prismaCode: error.code,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  if (!team) {
    return NextResponse.json(
      { message: "Failed to create team" },
      { status: 500 }
    );
  }

  try {
    const { id: stripe_customer_id } = await createStripeCustomer({
      customerName: teamName,
      customerEmail: email,
      metaData: { teamId: team.id },
    });

    await prisma.team.update({
      data: { stripe_customer_id },
      where: { id: team.id },
    });
  } catch (stripeError) {
    console.error("Stripe customer creation failed:", stripeError);
    return NextResponse.json({
       message: (stripeError as Error).message,
    },{
      status: 500
    })
  }

  return NextResponse.json(
    { message: `${teamName} created Successfully!` , teamId: team.id },
    { status: 201, headers: {
      'Set-Cookie': `team-slug=${team.id}`
    } },
  );
};
