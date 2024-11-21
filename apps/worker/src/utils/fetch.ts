// testing:
// "https://wayback.archive.org/"     <---- load time is high.

import { MonitorType } from "@repo/common/src/types";
import { createHeaders } from "./customHeader";

type FetcherProps = Omit<
  MonitorType,
  | "teamId"
  | "urlAlias"
  | "alertWhen"
  | "alertUsing"
  | "recoveryPeriod"
  | "confirmationPeriod"
  | "checkFrequency"
>;




export async function fetcher({
  url,
  httpMethods,
  httpRequestBody,
  headerName,
  headerValue,
  httpRequestTimeout = "1200",
}: FetcherProps) {
  const timeoutSignal = AbortSignal.timeout(Number(httpRequestTimeout));

  let customHeaders;

  if(headerName && headerValue){
    customHeaders = createHeaders({
        [headerName]: headerValue,
        "Content-Type": "application/json",
    })
    console.log("Custom Header: ", {
        headers: { ...customHeaders },
    });
  }

  try {
    const response = await fetch(url, {
      method: httpMethods ?? "GET",
      body: httpRequestBody,
      headers: customHeaders ? { ...customHeaders } : {},
      signal: timeoutSignal,
    });
    console.log('RESPONSEEEEE: ' , response);
    return response;
  } catch (err) {
    const error = err as Error;
    if (error.name === "TimeoutError") {
      console.error(`Timeout: It took more than ${httpRequestTimeout} seconds to get the result!`);
      throw err;
    } else if (error.name === "AbortError") {
      console.error(
        "Fetch aborted by user action (browser stop button, closing tab, etc."
      );
      throw err;
    } else if (error.name === "TypeError") {
      console.error(err);
    } else {
      // A network error, or some other problem.
      console.error(`Error: type: ${error}, message: ${error.message}`);
    }
  }
}
