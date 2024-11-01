import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import { mockedPrismaClient } from "../../../__mocks__/prisma";
import { auth } from "@/utils/auth";
import { POST } from "@/app/api/(teams)/create-team/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { createStripeCustomer } from "@/lib/stripe/customer";
import { Prisma } from "@prisma/client";

beforeEach(() => {
  vi.clearAllMocks(); // Reset all mocks
});

// 1. Mocks
vi.mock("../../../../utils/auth.ts", () => ({
  __esModule: true,
  auth: vi.fn(),
}));

vi.mock("@/utils/prisma", () => ({
  default: mockedPrismaClient,
}));
vi.mock("../../../../lib/stripe/customer.ts", () => ({
  createStripeCustomer: vi.fn(),
}));

// 2. I have added the describe blocks for testing.
const teamName = "Team A";
const email = "team@example.com";
const teamId = "team-id";
const stripe_customer_id = "stripe_customer_id";

describe("POST /create-team API", () => {
  describe("Authorization Tests", () => {
    it("should send unauthorized user", async () => {
      (auth as Mock).mockResolvedValueOnce(null);

      const req = createRequest<NextRequest>({
        method: "POST",
        body: {},
      });
      const res = createResponse<NextResponse>();

      const response = await POST(req, res);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        message: "Unauthorized access. Please Login",
      });
    });
    it("should have send 401 if email is not passed", async () => {
      (auth as Mock).mockResolvedValueOnce({
        user: {
          id: "1",
        },
      });
      const req = createRequest<NextRequest>({
        method: "POST",
        json: async () => ({
          teamName: "Team Testing",
          email: "", // empty email
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = createResponse<NextResponse>();

      const response = await POST(req, res);
      const data = await response.json();

      console.log("data: ", data);
      expect(response.status).toBe(401);
      expect(data.message).toBe("Email is required");
    });
  });

  describe("Team Creation Tests", () => {
    it("should create a team successfully", async () => {
      (auth as Mock).mockResolvedValue({
        user: {
          id: "1",
        },
      });
      const session = await auth();
      (prisma.team.create as Mock).mockResolvedValue({
        id: teamId,
        plan: "FREE",
        teamName,
        member: {
          create: {
            role: "OWNER",
            userId: String(session?.user?.id),
          },
        },
      });

      (createStripeCustomer as Mock).mockResolvedValue({
        id: stripe_customer_id,
      });

      (prisma.team.update as Mock).mockResolvedValue({});

      const req = createRequest<NextRequest>({
        method: "POST",
        json: async () => ({
          teamName,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = createResponse<NextResponse>();

      const response = await POST(req, res);
      const data = await response.json();

      console.log("data: ", data);

      expect(prisma.team.create).toHaveBeenCalledWith({
        data: {
          plan: "FREE",
          teamName,
          members: {
            create: {
              role: "OWNER",
              userId: "1",
            },
          },
        },
      });
      expect(createStripeCustomer).toHaveBeenCalledWith({
        customerName: teamName,
        customerEmail: email,
        metaData: { teamId },
      });
      expect(prisma.team.update).toHaveBeenCalledWith({
        data: { stripe_customer_id },
        where: { id: teamId },
      });

      expect(prisma.team.create).toHaveBeenCalledTimes(1);
      expect(createStripeCustomer).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(201);
      expect(data.message).contains("created Successfully!");
    });
    // test-coverages
    it("should return 500 if team creation failed", async () => {
      (auth as Mock).mockResolvedValue({
        user: {
          id: "1",
        },
      });
      (prisma.team.create as Mock).mockRejectedValue(new Error());

      (createStripeCustomer as Mock).mockResolvedValue({
        id: stripe_customer_id,
      });

      (prisma.team.update as Mock).mockResolvedValue({});

      const req = createRequest<NextRequest>({
        method: "POST",
        json: async () => ({
          teamName,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = createResponse<NextResponse>();

      const response = await POST(req, res);
      const data = await response.json();

      expect(prisma.team.create).toHaveBeenCalledWith({
        data: {
          plan: "FREE",
          teamName,
          members: {
            create: {
              role: "OWNER",
              userId: "1",
            },
          },
        },
      });
      expect(response.status).toBe(500);
    });
    it("prisma unique constraint", async () => {
      (auth as Mock).mockResolvedValue({
        user: {
          id: "1",
        },
      });
    
      // Simulate a unique constraint violation
      (prisma.team.create as Mock).mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError(
          "Unique constraint failed on the fields: (`teamName`)", 
          { 
            code: 'P2002', 
            meta: { target: ['teamName'] }, 
            clientVersion: ""
          }
        )
      );
    
      const req = createRequest<NextRequest>({
        method: "POST",
        json: async () => ({
          teamName,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = createResponse<NextResponse>();
    
      const response = await POST(req, res);
      const data = await response.json();
    
      // Check that the response is 500 and has the correct message
      expect(response.status).toBe(500);
      expect(data).toEqual({
        message: "Unique constraint failed on the fields: (`teamName`)",
        metaData: { target: ['teamName'] }, // Add whatever metadata you need to verify
        prismaCode: 'P2002',
      });
    });
    it("should return 500 if createStripeCustomer fails", async () => {
      (auth as Mock).mockResolvedValue({ user: { id: "1" } });
      (prisma.team.create as Mock).mockResolvedValue({ id: teamId, plan: "FREE", teamName: teamName });
      (createStripeCustomer as Mock).mockRejectedValue(new Error("Stripe error"));
    
      const req = createRequest<NextRequest>({
        method: "POST",
        json: async () => ({
          teamName,
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = createResponse<NextResponse>();
    
      const response = await POST(req, res);
      const data = await response.json();
    
      expect(response.status).toBe(500);
      expect(data.message).toBe("Stripe Error Response");
    });
  });
});
