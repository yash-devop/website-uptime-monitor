import { createStripeCustomer, getStripeCustomer } from "@/lib/stripe/customer";
import { auth } from "@/utils/auth";
import prisma, { Prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

type Plan = "FREE" | "PRO";

type Team = {
  teamName: string;
  email: string;
};

export const POST = async (req: NextRequest) => {
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
  const {
    teamName, // for now , later randomize it.
    email,
  }: Team = await req.json();

  try {
    const team = await prisma.team.create({
      // 1. Creating a Team without stripe_customer_id
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

    if (team) {
      try {
        const { id: stripe_customer_id } = await createStripeCustomer({
          // 2. I am creating stripe customer
          customerName: teamName,
          customerEmail: email,
          metaData: { teamId: team.id },
        });

        await prisma.team.update({
          // 3. Then we will update the stripe_customer_id
          data: {
            stripe_customer_id,
          },
          where: {
            id: team.id,
          },
        });
      } catch (stripeError) {
        console.error("Stripe customer creation failed:", stripeError);
      }
      return NextResponse.json(
        {
          message: `${teamName} created Successfully !`,
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          message: error.message,
          metaData: error.meta,
          prismaCode: error.code
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
