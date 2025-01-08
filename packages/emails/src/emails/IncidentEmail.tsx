import React from "react";
import {
  Body,
  Heading,
  Tailwind,
  Html,
  Head,
  Container,
  Font,
  Section,
  Hr,
  Text,
  Preview,
  Img,
  Column,
  Row,
  Button,
  Link,
} from "@react-email/components";
type IncidentProps = {
  status: "ongoing" | "acknowledged" | "resolved";
};
export function IncidentEmail({status}: IncidentProps) {
  return (
    <>
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
        <Tailwind>
          <Preview>Someone has invited you to join a team.</Preview>
          <Body className="mx-auto my-auto bg-[#f8f9fc]">
            <Container className="max-w-[590px] mx-auto w-full flex flex-col justify-start items-start min-h-screen rounded border border-solid border-gray-200 px-10 relative">
              <div
                className={`bg-red-500 absolute top-0 right-0 left-0 w-full h-[4px]`}
              />
              <Section className="text-left justify-start pt-12 flex flex-col">
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-3">
                    <div className={`size-3 rounded-full bg-red-500 ${status === "ongoing" ? "bg-red-500" : status === "acknowledged" ? "bg-yellow-500" : status === "resolved" ? "bg-green-500" : "bg-gray-800"}`} />
                    <p className="font-semibold">{status === "ongoing" ? "New incident started" : status === "acknowledged" ? "Incident acknowledged" : status === "resolved" ? "Incident resolved" : "Something went wrong"}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="font-light">
                      <p>Hello Yash,</p>
                      <p>Please acknowledge the incident.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        href={`url`}
                        className="bg-[#8c58ff] text-white rounded-md border border-solid border-gray-200 text-sm px-4 py-1.5 w-fit my-4 cursor-pointer pointer-events-auto"
                      >
                        Acknowledge Incident
                      </Button>
                      <Button
                        href={`url`}
                        className="bg-white text-green-3 rounded-md border border-solid border-gray-300 text-sm px-4 py-1.5 w-fit my-4 cursor-pointer pointer-events-auto"
                      >
                        View Incident
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[200px_200px] px-0 pt-6">
                    <Details title="Monitor:" status="httpstat.us/495" />
                    <Details
                      title="Checked URL:"
                      status={`${`GET https://httpstat.us/495`}`}
                    />
                    <Details title="Cause:" status={`Status 495`} />
                    <Details
                      title="Started at:"
                      status={`7 Jan 2025 at 09:45am IST`}
                    />
                  </div>
                  <div className="flex flex-col gap-2 border border-blue-400 pt-8">
                    <Text className="p-0 m-0 font-semibold">Response:</Text>
                    <Text className="p-2 m-0 border border-solid border-gray-400 rounded-lg">
                      495 SSL Certificate Error
                    </Text>
                  </div>
                </div>
                <footer className="bg-red-s400 pt-8 flex flex-col items-center justify-center">
                  {/* <Text className="p-0 m-0">control.</Text> */}
                  <Heading className="mx-0 mt-7 p-0 text-left text-2xl font-semibold tracking-[-1.8px] select-none text-[#8c58ff]">
                    control.
                  </Heading>
                  <Text className="p-0 m-0 text-xs">
                    24/7 uptime monitoring
                  </Text>
                </footer>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    </>
  );
}

function Details({
  title,
  status,
}: {
  title: string;
  status: string; // like url or any value.
}) {
  return (
    <>
      <Text className="p-0 m-0 font-semibold">{title}</Text>
      <Text className="p-0 m-0">{status}</Text>
    </>
  );
}
