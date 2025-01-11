import React from "react";
import {
  Html,
  Head,
  Tailwind,
  Body,
  Container,
  Section,
  Text,
  Button,
  Preview,
  Hr,
  Heading,
  Font,
  Row,
  Column,
} from "@react-email/components";

type IncidentProps = {
  teamId: string,
  incidentId: string,
  username: string,
  monitorName: string;
  incidentName: string;
  incidentStatus: "ongoing" | "validating" | "resolved";
  cause: string;
  url: string;
  date: string;
};

export function IncidentEmail({
  teamId,
  incidentId,
  username,
  monitorName,
  incidentName,
  incidentStatus,
  cause,
  url,
  date,
}: IncidentProps) {
  const BASE_URL = `http://localhost:3000`;

  const getCapitalizedStr = (str:string) => {
    const strIntoArr = str.split(" ");
    console.log(strIntoArr)
    const capitalized = strIntoArr.map((val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });
  
    return capitalized.join(" ");
  };
  
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Inter"
          rel="stylesheet"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.googleapis.com/css?family=Inter",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        {incidentStatus === "ongoing"
          ? `The incident for ${url} has been initiated.`
          : incidentStatus === "validating"
            ? `The incident for ${url} is being validated.`
            : `The incident for ${url} has been resolved.`}
      </Preview>
      <Tailwind>
        <Body
          className="mx-auto my-auto bg-[#f8f9fc]"
          style={{ fontFamily: "Inter" }}
        >
          <Container className="bg-white max-w-[590px] mx-auto rounded border border-solid border-gray-200 px-10 relative">
            <div
              className={`${
                incidentStatus === "ongoing"
                  ? `bg-red-500`
                  : incidentStatus === "validating"
                    ? `bg-yellow-500`
                    : incidentStatus === "resolved"
                      ? `bg-green-500`
                      : "bg-gray-800"
              } absolute top-0 right-0 left-0 w-full h-[4px]`}
            />
            <Section className="py-8">
              <Row className="">
                <Column className="w-[20px]">
                  <Text
                    className={`w-3 h-3 p-0 rounded-full ${
                      incidentStatus === "ongoing"
                        ? "bg-red-500"
                        : incidentStatus === "validating"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></Text>
                </Column>
                <Column>
                  <Text className="text-lg font-semibold text-gray-900">
                    {incidentStatus === "ongoing"
                      ? "New Incident Started"
                      : incidentStatus === "validating"
                        ? "Incident Acknowledged"
                        : "Incident Resolved"}
                  </Text>
                </Column>
              </Row>
              <Text className="text-sm text-gray-600">
                Hello {getCapitalizedStr(username)},
                <br />
                Please review the details of the incident below:
              </Text>
              <Section>
                <Details title="Monitor:" incidentStatus={monitorName} />
                <Details title="Checked URL:" incidentStatus={`GET ${url}`} />
                <Details title="Cause:" incidentStatus={incidentName} />
                <Details title="Started at:" incidentStatus={date} />
              </Section>
              <Section className="my-6">
                {incidentStatus === "ongoing" && (
                  <Button
                    className="bg-purple-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-700 no-underline"
                    href={`${BASE_URL}/dashboard/team/${teamId}/incidents/${incidentId}`}
                  >
                    Acknowledge Incident
                  </Button>
                )}
                <Button
                  className="bg-gray-100 text-gray-800 rounded-md px-4 py-2 mt-3 text-sm font-medium hover:bg-gray-200 border border-gray-300 no-underline"
                  href={`${BASE_URL}/dashboard/team/${teamId}/incidents/${incidentId}`}
                >
                  View Incident
                </Button>
              </Section>
              <Hr className="border-gray-200 my-6" />
              <Section>
                <Text className="p-0 m-0 font-semibold">Response:</Text>
                <Text className="p-2 mt-1 border border-solid border-gray-300 rounded-lg capitalize">
                  {cause}
                </Text>
              </Section>
              <Section className="mt-8 pb-4">
                <Heading className="mx-0 mt-7 p-0 text-center text-2xl font-semibold tracking-[-1.8px] select-none text-[#8c58ff]">
                  control.
                </Heading>
                <Text className="p-0 m-0 text-xs text-center">
                  24/7 uptime monitoring
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

function Details({ title, incidentStatus }: { title: string; incidentStatus: string }) {
  return (
    <>
      <div className="flex">
        <Text className="p-0 m-0 min-w-[160px] font-semibold">{title}</Text>
        <Text className="p-0 m-0 font-mono">{incidentStatus}</Text>
      </div>
    </>
  );
}

// import React from "react";
// import {
//   Body,
//   Heading,
//   Tailwind,
//   Html,
//   Head,
//   Container,
//   Font,
//   Section,
//   Hr,
//   Text,
//   Preview,
//   Img,
//   Column,
//   Row,
//   Button,
//   Link,
// } from "@react-email/components";
// type IncidentProps = {
//   incidentStatus: "ongoing" | "validating" | "resolved";
//   url: string;
//   date: string;
// };
// export function IncidentEmail({ incidentStatus, url }: IncidentProps) {
//   return (
//     <>
//       <Html>
//         <Head>
//           <link
//             href="https://fonts.googleapis.com/css?family=Inter"
//             rel="stylesheet"
//           />
//           <Font
//             fontFamily="Inter"
//             fallbackFontFamily="Helvetica"
//             webFont={{
//               url: "https://fonts.googleapis.com/css?family=Inter",
//               format: "woff2",
//             }}
//             fontWeight={400}
//             fontStyle="normal"
//           />
//         </Head>
//         <Tailwind>
//           <Preview>
//             {incidentStatus === "ongoing"
//               ? `The incident for ${url} has been initiated.`
//               : incidentStatus === "validating"
//                 ? `The incident for ${url} has been acknowledged, and we are in the process of validating the details.`
//                 : incidentStatus === "resolved"
//                   ? `The incident for ${url} has been resolved. Everything is back to normal, and the issue has been addressed.`
//                   : "Something went wrong"}
//           </Preview>
//           <Body className="mx-auto my-auto bg-[#f8f9fc]">
//             <Container className="max-w-[590px] mx-auto w-full flex flex-col justify-start items-start min-h-screen rounded border border-solid border-gray-200 px-10 relative">
//               <div
//                 className={`bg-red-500 absolute top-0 right-0 left-0 w-full h-[4px]`}
//               />
//               <Section className="text-left justify-start pt-12 flex flex-col">
//                 <div className="flex flex-col flex-grow">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`size-3 rounded-full bg-red-500 ${incidentStatus === "ongoing" ? "bg-red-500" : incidentStatus === "validating" ? "bg-yellow-500" : incidentStatus === "resolved" ? "bg-green-500" : "bg-gray-800"}`}
//                     />
//                     <p className="font-semibold">
//                       {incidentStatus === "ongoing"
//                         ? "New incident started"
//                         : incidentStatus === "validating"
//                           ? "Incident acknowledged"
//                           : incidentStatus === "resolved"
//                             ? "Incident resolved"
//                             : "Something went wrong"}
//                     </p>
//                   </div>
//                   <div className="flex flex-col">
//                     <div className="font-light">
//                       <p>Hello Yash,</p>
//                       <p>Please acknowledge the incident.</p>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Button
//                         href={`url`}
//                         className="bg-[#8c58ff] text-white rounded-md border border-solid border-gray-200 text-sm px-4 py-1.5 w-fit my-4 cursor-pointer pointer-events-auto"
//                       >
//                         Acknowledge Incident
//                       </Button>
//                       <Button
//                         href={`url`}
//                         className="bg-white text-green-3 rounded-md border border-solid border-gray-300 text-sm px-4 py-1.5 w-fit my-4 cursor-pointer pointer-events-auto"
//                       >
//                         View Incident
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-[200px_200px] px-0 pt-6">
//                     <Details title="Monitor:" incidentStatus="httpstat.us/495" />
//                     <Details
//                       title="Checked URL:"
//                       incidentStatus={`${`GET https://httpstat.us/495`}`}
//                     />
//                     <Details title="Cause:" incidentStatus={`Status 495`} />
//                     <Details
//                       title="Started at:"
//                       incidentStatus={`7 Jan 2025 at 09:45am IST`}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 border border-blue-400 pt-8">
//                     <Text className="p-0 m-0 font-semibold">Response:</Text>
//                     <Text className="p-2 m-0 border border-solid border-gray-400 rounded-lg">
//                       495 SSL Certificate Error
//                     </Text>
//                   </div>
//                 </div>
//                 <footer className="bg-red-s400 pt-8 flex flex-col items-center justify-center">
//                   {/* <Text className="p-0 m-0">control.</Text> */}
//                   <Heading className="mx-0 mt-7 p-0 text-left text-2xl font-semibold tracking-[-1.8px] select-none text-[#8c58ff]">
//                     control.
//                   </Heading>
//                   <Text className="p-0 m-0 text-xs">
//                     24/7 uptime monitoring
//                   </Text>
//                 </footer>
//               </Section>
//             </Container>
//           </Body>
//         </Tailwind>
//       </Html>
//     </>
//   );
// }

// function Details({
//   title,
//   incidentStatus,
// }: {
//   title: string;
//   incidentStatus: string; // like url or any value.
// }) {
//   return (
//     <>
//       <Text className="p-0 m-0 font-semibold">{title}</Text>
//       <Text className="p-0 m-0">{incidentStatus}</Text>
//     </>
//   );
// }
