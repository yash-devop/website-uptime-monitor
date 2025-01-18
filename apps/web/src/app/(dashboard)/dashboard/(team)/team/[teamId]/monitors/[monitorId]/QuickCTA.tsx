"use client";

import { cn } from "@/lib/utils";
import { LucideProps, Settings, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import React, { useState } from "react";
export const MonitorCTA = () => {
  const pathname = usePathname();
  const router = useRouter();

  console.log("pathname: ", pathname.split("monitors")[0] + "incidents/");
  const [open , setOpen] = useState(false)
  const { teamId, monitorId } = useParams();
  console.log("params", teamId);
  const handleRemoveMonitor = async () => {
    setOpen(false)
    try {
      const response = await fetch(
        `/api/team/${teamId}/monitors/${monitorId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // other than 2xx and 3xx
        const { error } = await response.json();
        throw new Error(error).message;
      }

      const result = await response.json();
      console.log("result:", result);

      toast.success(result?.message);

      router.push(`/dashboard/team/${teamId}/monitors`);
    } catch (error) {
      const err = (error as Error).message;
      console.log("error", err);
      toast.error(err);
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-6">
        <QuickCTA
          href={pathname.split("monitors")[0] + "incidents/"}
          Icon={ShieldAlert}
          name="View Incidents"
          className="hover:bg-blue-500/10 hover:text-blue-500"
        />
        <QuickCTA
          href={`${pathname}/edit`}
          Icon={Settings}
          name="Edit monitor"
          className="hover:bg-green-500/10 hover:text-green-500"
        />
        <QuickCTA
          href="/"
          name="Remove"
          className="hover:bg-red-500/10 hover:text-red-500"
        >
          <Dialog open={open} onOpenChange={(val)=>setOpen(val)}>
            <DialogTrigger asChild className="">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4 hover:bg-red-500/10 hover:text-red-500">
                <Trash2 size={16}/>
                Remove
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure , you wanna delete ?</DialogTitle>
                <DialogDescription>
                  This step is irrevertible , so recheck before deleting.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" variant={"destructive"} onClick={handleRemoveMonitor}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </QuickCTA>
      </div>
    </>
  );
};

const QuickCTA = ({
  Icon,
  name,
  className,
  href,
  onClick,
  children,
}: {
  Icon?: React.ComponentType<LucideProps>; // Make Icon optional
  name: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  if (children) {
    return <>{children}</>;
  }

  return (
    <Link
      href={href || ""}
      className={cn(
        `flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-neutral-7 rounded-md select-none cursor-pointer transition-all text-neutral-4`,
        className
      )}
      onClick={onClick}
    >
      {/* Conditionally render Icon */}
      {Icon && <Icon size={16} />}
      <span className="text-balance">{name}</span>
    </Link>
  );
};
