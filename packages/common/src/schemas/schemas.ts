import { z } from "zod";
// import { type MonitorType , CheckFrequencyType } from "@repo/common";
import { ALERT_USING, HTTP_METHODS, URL_ALERT_TYPES } from "@repo/db";
import { CHECK_FREQUENCIES } from "../constants/monitor";

// Team Schema

export const TeamSchema = z.object({
    teamName: z.string(),
    email: z.string().email({
        message :"Not a valid email brotha."
    })
})



export const monitorSchema = z.object({
    teamId: z.string().cuid(),
    url: z.string().url(),
    alertWhen: z.nativeEnum(URL_ALERT_TYPES),
    alertUsing: z.nativeEnum(ALERT_USING),
    checkFrequency: z.enum(CHECK_FREQUENCIES),
    recoveryPeriod: z.number(),
    confirmationPeriod: z.number(),
    httpMethods: z.nativeEnum(HTTP_METHODS).optional(),
    httpRequestTimeout: z.number(),
    urlAlias: z.string(),
    headerName: z.string().optional(),
    headerValue: z.string().optional(),
    httpRequestBody: z.string().optional(),
    regions: z.string().array()
})

// Invitation Schema
// Members Schema
// Monitor Schema
// ...