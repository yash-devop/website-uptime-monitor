import { APIGatewayProxyResult } from "aws-lambda";
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

module.exports.handler  = async (
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
  } = event.monitorData;        // in development do : JSON.parse(event.body)

  const {currentRegion} = event;
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
  const webStatus = isUp ? "up" : "down"
  const end = performance.now();
  const responseTime = Number((end - start).toFixed(0));
  const headers = response?.headers;
  
  if(!success){   // Error Occured.
    return {
      statusCode: 200, // status code of the lambda function and not the Tested URL. 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success,
        message: "Lambda Response ❌",
        region: currentRegion,
        data: {
          response,
          responseTime,
          url,
          statusCode: statusCode,
          isUp: false,
          webStatus,
          down_at,
          error: {
            name: error?.name,
            cause: error?.cause,
            type: error?.type
          }
        },
      }),
    };
  }

  return {
    statusCode: 200, // status code of the lambda function
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
        isUp: isUp,
        webStatus,
        down_at,
        responseTime,
        headers
      },
    }),
  };
};
