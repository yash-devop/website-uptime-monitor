"use client";

import { signOut } from "next-auth/react";
import { buttonVariants } from "./ui/button";
import { LogOut } from "lucide-react";
import { VariantProps } from "class-variance-authority";

export default function ClientSideLogoutButton({
  icon = <LogOut size={17}/>,
}:{
  icon?: React.ReactElement
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  return (
    <>
      <div
        onClick={async () => await signOut()}
        className={`flex items-center gap-2 w-full px-4 py-2.5 text-neutral-2 hover:text-white hover:bg-destructive rounded-md transition-all duration-150 cursor-pointer`}
      >
        {icon}
        <span>Sign out</span>
      </div>
    </>
  );
}
