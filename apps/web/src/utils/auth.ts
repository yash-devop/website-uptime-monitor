import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@repo/db/prisma";
import GitHub from "next-auth/providers/github";
import { NextAuthConfig } from "next-auth";
import { getUniqueTeamName } from "./getUniqueTeamName";

export const AUTH_OPTIONS = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login`,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async signIn({ user, account, profile }) {
      // Check if the user exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        console.log('NOT EXISTING USER... Will create a new one for u with team.');
        // Create a new user if they don't exist
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            image: user.image!,
          },
        });

        // After creating the user, create a team associated with the user
        const uniqueName = getUniqueTeamName();
        await prisma.team.create({
          data: {
            plan: "FREE",
            teamName: uniqueName + "TESTING",
            members: {
              create: {
                role: "OWNER",
                userId: String(newUser.id),             
              },
        }}});
      }

      return true; // Continue with the sign-in process
    },
  },
  session: {
    strategy: "jwt"       // veryimportant, if not provided , then authjs will give prisma client edge runtime error.
  }
} as NextAuthConfig;
export const { handlers, signIn, signOut, auth } = NextAuth(AUTH_OPTIONS);
