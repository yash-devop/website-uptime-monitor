"use client";

import { signIn } from "next-auth/react";
import { Button, ButtonProps } from "./ui/button";
import { GoogleIcon } from "./icons/Google";
import { GithubIcon } from "./icons/Github";
import { cn } from "@/lib/utils";
import React from "react";

export default function ClientAuthButton({
  type,
  redirectTo = "dashboard",
  buttonProps,
}: {
  type: "github" | "google";
  redirectTo: string;
  buttonProps?: ButtonProps;
}) {
  const authRenderer:{
    [key:string]: {
        title: string,
        icon?:React.JSX.Element
    }
  } = {
    github: {
        title: "Continue with Github",
        icon: <GithubIcon />
    },
    google: {
        title: "Continue with Google",
        icon: <GoogleIcon />
    },
  };
  return (
      <Button
        type="button"
        onClick={async () =>
          await signIn(type, {
            redirectTo,
          })
        }
        size={buttonProps?.size || "lg"}
        variant={buttonProps?.variant || "outline"}
        className={cn(`w-full p-6`, buttonProps?.className)}
        {...buttonProps}
      >
        {authRenderer[type]?.icon}
        <p>{authRenderer[type]?.title}</p>
      </Button>
  );
}
