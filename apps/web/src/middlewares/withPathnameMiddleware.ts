import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

export function withPathnameMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    console.log('path middleware is WORKING');
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);
    console.log("Current path aya re:", request.nextUrl.pathname);
    // request.headers.set("x-current-path",request.nextUrl.pathname)
    const res = NextResponse.next({
        request:{
          headers
        }
    });
    return middleware(request, event, res);
  };
}
