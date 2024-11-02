import { Request, Response } from "express";
import { NextRequest, NextResponse } from "next/server";
import { createRequest, createResponse, MockRequest, MockResponse, RequestOptions } from "node-mocks-http";


type ReturnType = {
    req: MockRequest<NextRequest>,
    res: MockResponse<NextResponse>
}
function createMockHTTP(options: RequestOptions):ReturnType {
  const req = createRequest<NextRequest>({
    method: "POST",
    json: async () => (options.body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = createResponse<NextResponse>();
  return {req,res}
}


export {
    createMockHTTP
}