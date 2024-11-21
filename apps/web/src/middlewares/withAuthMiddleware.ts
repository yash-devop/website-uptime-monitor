import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";
import { auth } from "@/utils/auth";

export function withAuthMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    console.log('auth middleware is WORKING');

    return middleware(request, event, response);
  };
}
