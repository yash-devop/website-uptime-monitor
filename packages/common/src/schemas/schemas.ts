import { z } from "zod";
// import { type MonitorType , CheckFrequencyType } from "@repo/common";
import { ALERT_USING, HTTP_METHODS, URL_ALERT_TYPES } from "../../../db";
// import { ALERT_USING, HTTP_METHODS, URL_ALERT_TYPES } from "@repo/db";
import { CHECK_FREQUENCIES } from "../constants/monitor";

// Team Schema

export const TeamSchema = z.object({
    teamName: z.string(),
    email: z.string().email({
        message :"Not a valid email brotha."
    })
})



export const monitorSchema = z.object({
    teamId: z.string({
        required_error: "Team ID is required"
    }),
    url: z.string({
        required_error: "Monitoring URL is required"
    }).url(),
    alertWhen: z.nativeEnum(URL_ALERT_TYPES , {
        required_error: "Alert when is required"
    }),
    alertUsing: z.nativeEnum(ALERT_USING),
    checkFrequency: z.enum(CHECK_FREQUENCIES , {
        required_error: "Check Frequency is required"
    }),
    recoveryPeriod: z.number({
        required_error: "Recovery period is required"
    }),
    confirmationPeriod: z.number({
        required_error: "Confirmation period is required"
    }),
    httpMethods: z.nativeEnum(HTTP_METHODS).optional(),
    httpRequestTimeout: z.number({
        required_error: "HTTP Request timeout is required"
    }),
    urlAlias: z.string({
        required_error: "Friendly monitor name is required"
    }).min(4,{
        message: "Please give a bit more..."
    }),
    headerName: z.string().optional(),
    headerValue: z.string().optional(),
    httpRequestBody: z.string().optional(),
    regions: z.string({
        required_error: "Monitoring URL is required"
    }).array()
})

// Invitation Schema
// Members Schema
// Monitor Schema
// ...