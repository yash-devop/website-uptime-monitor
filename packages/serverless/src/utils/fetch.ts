// testing:
// "https://wayback.archive.org/"     <---- load time is high.

import { MonitorType } from "@repo/common";
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
  | "regions"
> & {
  currentRegion: string;
};

type FetcherReturnType = {
  success: boolean;
  response?: Response;
  error?: {
    name: string;
    cause: string;
    type: "timeout" | "aborted" | "httpError" | "dnsFailure";
  };
};

export async function fetcher({
  url,
  httpMethods,
  httpRequestBody,
  headerName,
  headerValue,
  httpRequestTimeout = 1400,
}: FetcherProps): Promise<FetcherReturnType> {
  const timeoutSignal = AbortSignal.timeout(Number(httpRequestTimeout));

  let customHeaders;

  if (headerName && headerValue) {
    customHeaders = createHeaders({
      [headerName]: headerValue,
      "Content-Type": "application/json",
    });
  }

  try {
    type UppercaseMethods = Uppercase<typeof httpMethods>;
    const method = (httpMethods && httpMethods.toUpperCase() as UppercaseMethods) ?? "GET";
    const response = await fetch(url, {
      method: method,
      body: method !== "GET" ? httpRequestBody : null,
      headers: customHeaders ? { ...customHeaders } : {},
      signal: timeoutSignal,
    });
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.name = `Status ${response.status}`;
      throw error;
    }
    return {
      success: true,
      response,
    };
  } catch (err) {
    const error = err as Error;
    console.log("Error in fetcher catch block:", error);
    if (error.name === "TimeoutError") {
      console.error(
        `Timeout: It took more than ${httpRequestTimeout} seconds to get the result!`
      );
      return {
        success: false,
        error: {
          name: "HTTP Timeout",
          cause: error.message,
          type: "timeout",
        },
      };
    } else if (error.name === "AbortError") {
      console.error(
        "Fetch aborted by user action (browser stop button, closing tab, etc."
      );
      return {
        success: false,
        error: {
          name: "HTTP Aborted",
          cause: error.message,
          type: "aborted",
        },
      };
    } else if (error.name === "TypeError") {
      console.error("DNS Failure", err);
      return {
        success: false,
        error: {
          name: "DNS Failure",
          cause: error.message,
          type: "dnsFailure",
        },
      };
    } else {
      // A network error, or some other problem.
      console.error(`Error: type: ${error}, message: ${error.message}`);
      return {
        success: false,
        error: {
          name: error.name,
          cause: error.message,
          type: "httpError",
        },
      };
    }
  }
}
