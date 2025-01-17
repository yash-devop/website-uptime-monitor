import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
} from "next/server";
import { CustomMiddleware } from "./chain";

export function testingMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {


    console.log('x-current-path in TESTING MIDDLEWARE: ', response.headers.get("x-middleware-request-x-current-path"));

    return middleware(request, event, response);
  };
}
