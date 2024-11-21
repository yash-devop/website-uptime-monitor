import { CHECK_FREQUENCIES } from "@repo/common/src/constants";
import { ALERT_USING, HTTP_METHODS, URL_ALERT_TYPES } from "@prisma/client";

export type MonitorType = {
  teamId: string,
  url: string;
  urlAlias: string;
  alertWhen: URL_ALERT_TYPES;
  alertUsing: ALERT_USING;
  recoveryPeriod: number;
  confirmationPeriod: number;
  checkFrequency: CheckFrequencyType; // not an enum coz later will add more freqs. defined in /constants folder
  httpMethods: HTTP_METHODS;
  httpRequestTimeout: string; // in constants folder
  httpRequestBody?: string;
  headerName?: string;
  headerValue?: string;
  regions: string[]
};

export type Regions = [""]

export type CheckFrequencyType = (typeof CHECK_FREQUENCIES)[number];
