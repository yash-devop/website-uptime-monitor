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
  Preview,
  Img,
  Column,
  Button,
  Link,
} from "@react-email/components";
import React from "react";
interface EmailProps {
  url: string;
  inviterImage: string,
  inviterEmail: string
  teamName: string
}

export default function InvitationEmail({ url , inviterImage , teamName = "Placeholder", inviterEmail}: EmailProps) {
  const pattern = /(team|Team)/

  const matched = teamName?.match(pattern)?.[0]
  const isTeamLabel = matched === "Team" || matched === "team"
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
          <Body className="mx-auto my-auto bg-[#f8f9fc] p-5">
            <Container className="max-w-[750px] mx-auto rounded border border-solid border-gray-200 px-10 py-5 my-12 bg-white">
              <Section>
                <Heading className="mx-0 my-7 p-0 text-center text-2xl font-semibold tracking-[-1.8px] select-none text-[#8c58ff]">
                  control.
                </Heading>
                <Hr className="bg-gray-300" />
              </Section>
              <Section className="max-w-[500px] mx-auto">
                <Column align="center" className="mx-auto">
                    <Img
                      src={!inviterImage ? "https://pbs.twimg.com/profile_images/77846223/profile_400x400.jpg" : inviterImage}
                      // src="https://pbs.twimg.com/profile_images/77846223/profile_400x400.jpg"
                      width={70}
                      height={70}
                      className="mt-4 text-center"
                    />

                    <Heading
                      as="h4"
                      className="text-md leading-6 text-center font-light text-[#525f7f] max-w-sm"
                    >
                      <p>{inviterEmail} has invited you to join <strong className="text-[#525f7f]">{isTeamLabel ? teamName : `Team ${teamName}`}</strong></p>
                    </Heading>
                </Column>
              </Section>
              <div className="flex flex-col items-center justify-center -mt-10 pb-6">
                  <Button href={url} className="bg-[#8c58ff] text-white rounded-md border border-solid border-gray-200 text-sm px-4 py-1.5 mx-auto text-center my-4 cursor-pointer pointer-events-auto">
                    Join team
                  </Button>
              </div>
              <Heading
                  as="h4"
                  className="text-xs leading-6 font-extralight text-center text-[#525f7f]/50"
                >
                  <p>For more information, visit <Link href="https://controluptime.yashstack.com"><span className="text-[#8c58ff]">controluptime.yashstack.com</span></Link></p>
                </Heading>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    </>
  );
}
