import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";
import { redis } from "@/lib/redis/redis";
import { cookies } from "next/headers";

type Team = {
    id: string;
    userId: string;
    teamId: string;
    role: string;
  }[];
  

export function createTeamMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
        console.log('create-team middleware is WORKING');
        console.log('x-current-path from MDLW 2: ', response.headers.get("x-middleware-request-x-current-path"));
        const url = request.nextUrl.clone();
        const paramTeamId = url.pathname.split("/")[3];
        const teamSlugCookie = cookies().get("team-slug")?.value;

        const cachedTeamId = await redis.get(`teamId:${paramTeamId}`); // Replace with logic to fetch from cache if available
    
        if (paramTeamId === cachedTeamId) {
          console.log("CACHED VALUE MATCHED !!");
          response.cookies.set("team-slug", paramTeamId);
          return middleware(request, event, response);

        } else {
          const hasTeamSlug = !!paramTeamId && paramTeamId.trim() !== "";
          const res = await fetch("http://localhost:3000/api/check-team", {
            // i had to use the fetch method bcoz nextjs middleware and my prisma edge are not compatible... im not using edge features of prisma.
            method: "POST",
            headers: {
              Cookie: request.headers.get("cookie") || "",
              "Content-Type": "application/json",
            },
          });
          const { teams }: { exist: boolean; teams: Team } = await res.json();
          if (hasTeamSlug) {
            const hasTeamAccess =
              teams.length > 0
                ? teams.find((team) => team.teamId === paramTeamId)
                : null;
            console.log("hasTeamAccess :", hasTeamAccess);
            if (hasTeamAccess) {
              console.log("yes team is present in Database array !");
    
              await redis.set(`teamId:${paramTeamId}`, paramTeamId); // store in redis as cache
              const hasChanged = teamSlugCookie !== paramTeamId;
    
              if (hasChanged) {
                const response = NextResponse.redirect(url);
                response.cookies.set("team-slug", paramTeamId);
                return response;
              }
              return middleware(request, event, response);
            } else {
              return NextResponse.redirect(new URL("/dashboard/team/", request.url));
            }
          } else {
            console.log("teams:", teams);
    
            const fallbackTeamId = teams.length > 0 ? teams[0].teamId : "";
    
            console.log("fallbacked team id: ", fallbackTeamId);
    
            return NextResponse.redirect(
              new URL(`/dashboard/team/${fallbackTeamId}/monitors`, request.url)
            );
          }
        }
    }    
  };
