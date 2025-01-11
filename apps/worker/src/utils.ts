import { INCIDENT_STATUS } from "@repo/db";
import { IncidentEmail, render, sendEmail } from "@repo/emails";
import { format } from "date-fns";

type NotifyTeamType = {
  user: {
    name: string | null,
    email: string;
  };
};
export async function notifyIncidentToTeam<T extends NotifyTeamType>(
  teamId: string,
  incidentId: string,
  monitorName: string,
  members: T[],
  url: string,
  incidentName: string,
  incidentStatus: INCIDENT_STATUS,
  createdAt: string,
  cause: string
) {
  console.log("monitorname", monitorName);
  const emailPromise = members.map(async (member) => {
    await sendEmail({
      from: "controlweb.dev@gmail.com",
      html: await render(
        IncidentEmail({
          username: member.user.name ?? "User",
          teamId,
          incidentId,
          incidentName,
          incidentStatus,
          url,
          date: createdAt,
          monitorName,
          cause,
        })
      ),
      subject: `${incidentStatus === "ongoing" ? `Incident for ${url} has started - ${createdAt}` : incidentStatus === "validating" ? `Incident for ${url} has been acknowledged` : incidentStatus === "resolved" ? `Incident for ${url} has been resolved` : "Something went wrong"}`,
      to: member.user.email,
    });
  });
  await Promise.allSettled(emailPromise);
}

export function getPrettyDate(date: Date, formatStr?: string) {
  if (formatStr) {
    return format(date, formatStr);
  }
  return format(date, "dd MMM yyyy 'at' hh:mma 'IST'");
}
