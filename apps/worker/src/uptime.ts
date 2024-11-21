import { APIGatewayProxyResult } from "aws-lambda";
import { MonitorType } from "@repo/common/src/types";
import { fetcher } from "./utils/fetch";

module.exports.handler = async (
  event:any
): Promise<APIGatewayProxyResult> => {
  const {
    url,
    regions,
    headerName,
    headerValue,
    httpMethods,
    httpRequestTimeout,
    httpRequestBody,
  }: MonitorType = event;
  const start = performance.now();

  const response = await fetcher({
    url,
    regions,
    headerName,
    headerValue,
    httpMethods,
    httpRequestTimeout,
    httpRequestBody,
  });
  const end = performance.now();
  const statusCode = response?.status;
  const headers = response?.headers;
  const isOk = response?.ok;
  return {
    statusCode: 200,    // status code of the lambda function
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "OKAY BHAI",
      responseTime: `${(end - start).toFixed(0)} ms`,
      responseData: {
        statusCode,
        headers,
        isOk
      },
    }),
  };
};
