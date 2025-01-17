"use client";
import { Control } from "@/app/components/icons/Control";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/lib/utils";
import { FetchError } from "@/utils/fetcher";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Codes =
  | "INVALID"
  | "INVITE_NOT_FOUND"
  | "ALREADY_ACCEPTED"
  | "ALREADY_PRESENT"
  | "SUCCESS"
  | "FAILED_TO_JOIN"
  | "LOADING";
export default function JoinTeamPage() {
  const [data, setData] = useState<{
    message: string;
    error?: string;
    code: Codes | null;
  }>({
    message: "",
    error: "",
    code: null,
  });
  const { teamId } = useParams();
  console.log("teamId: ", teamId);
  const token = useSearchParams().get("token");
  if (!token) {
    return (
      <>
        <JoinLayout>
          <StatusOverlay className="border-destructive bg-destructive/10">
            <p>404: Token not found</p>
          </StatusOverlay>
        </JoinLayout>
      </>
    );
  }

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch(`/api/team/join/${teamId}`, {
          method: "POST",
          body: JSON.stringify({
            inviteToken: token,
          }),
        });
        if(res.status === 307){
            window.location.href = ""
        }
        if (!res.ok) {
          const error = new Error(
            "An error occured while fetching data"
          ) as FetchError;
          error.info = await res.json();
          error.statusCode = res.status;

          throw error;
        }

      } catch (error) {
        const err = (error as FetchError)
          setData({
              message: "",  
              error: err.info.message,
              code: err.info.code
            });
      }
    };

    handler();
  }, [teamId , token]);

  const render = {
    INVALID: {
      code: "498: Invalid or Expired Invitation token",
      className: "bg-destructive/10 border-destructive text-red-400",
    },
    INVITE_NOT_FOUND: {
      code: "404: Invitation not found",
      className: "bg-destructive/10 border-destructive text-red-400",
    },
    USER_NOT_FOUND: {
      code: "404: User not found. Please Register",
      className: "bg-destructive/10 border-destructive text-red-400",
    },
    ALREADY_ACCEPTED: {
      code: "202: Already invitation accepted",
      className: "border-blue-500 bg-blue-500/10 text-blue-400",
    },
    ALREADY_PRESENT: {
      code: "200: Already you are in the team",
      className: "border-blue-500 bg-blue-500/10 text-blue-400",
    },
    SUCCESS: {
      code: "200: Successfully joined the team",
      className: "border-green-1 bg-green-1/10 text-green-2",
    },
    FAILED_TO_JOIN: {
      code: "500: Failed to join team",
      className: "bg-destructive/10 border-destructive text-red-400",
    },
    LOADING: {
      code: "Gathering Information...",
      className:
        "border-blue-500 bg-blue-500/10 text-blue-400 animate-pulse duration-[1000]",
    },
  };
  return (
    <>
      <JoinLayout>
        <StatusOverlay
          className={`${render[data.code ?? "LOADING"].className}`}
        >
          <p>{render[data.code ?? "LOADING"].code}</p>
        </StatusOverlay>
      </JoinLayout>
    </>
  );
}

function JoinLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10">
        <div className="flex flex-col gap-5 items-center justify-center">
          <Control variant="md" />
          {children}
        </div>
        <Separator
          orientation="vertical"
          className="h-[80px] text-sidebar-border bg-sidebar-border hidden lg:block"
        />
        <div className="flex items-center group justify-center gap-2">
          <Button variant={"link"} size={"sm"} className="text-white p-0">
            <Link href={`/dashboard`}>Go to Dashboard</Link>
          </Button>
          <ArrowRight
            size={16}
            className="shrink-0 group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </>
  );
}

function StatusOverlay({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={cn("border py-1.5 px-4 rounded-lg", className)}>
        {children}
      </div>
    </>
  );
}
