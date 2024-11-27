import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { MonitorType } from "@repo/common";
import { fetcher } from "./utils/fetch";
import { isWebsiteUp } from "./utils/isWebsiteUp";
import { config } from "dotenv";

config();

type AlteredMonitorType = Omit<
  MonitorType,
  | "regions"
  | "alertUsing"
  | "alertWhen"
  | "recoveryPeriod"
  | "confirmationPeriod"
  | "checkFrequency"
  | "teamId"
  | "urlAlias"
> & {
  currentRegion: string;
};

module.exports.handler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  console.log("Incoming event:", event);

  const {
    url,
    headerName,
    headerValue,
    httpMethods,
    httpRequestTimeout,
    httpRequestBody,
    currentRegion,
  } = event;        // in development do : JSON.parse(event.body)

  const start = performance.now();

  const result = await fetcher({
    url,
    headerName,
    headerValue,
    httpMethods,
    httpRequestTimeout,
    httpRequestBody,
    currentRegion,
  });

  const {
    success,
    error,
    response
  } = result

  const statusCode = response?.status;
  const current_date_time = new Date(Date.now());
  const isUp = isWebsiteUp(statusCode!);
  const down_at = !isUp ? current_date_time : null;

  if(!success){   // Error Occured.
    return {
      statusCode: 200, // status code of the lambda function and not the Tested URL. 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success,
        message: "Lambda Response ✅",
        region: currentRegion,
        data: {
          url,
          statusCode,
          isUp: false,
          webStatus: isUp ? "up" : "down",
          down_at,
          errorName: error?.name,
          errorCause: error?.cause
        },
      }),
    };
  }
  const end = performance.now();
  const responseTime = (end - start).toFixed(0);
  const headers = response?.headers;

  return {
    statusCode: 200, // status code of the lambda function
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Lambda Response ✅",
      region: currentRegion,
      data: {
        success,
        url,
        responseTime,
        headers,
        statusCode,
        isUp: isUp,
        webStatus: isUp ? "up" : "down",
        down_at,
      },
    }),
  };
};
