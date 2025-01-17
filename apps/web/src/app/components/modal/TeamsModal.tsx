"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "../ui/button";
import { Send, Users, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { fetcher } from "@/utils/fetcher";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

export default function TeamsModal() {
  const [invitees, setInvitees] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const teamId = pathname.split("/")[3];

  console.log("teamId", teamId);
  const emailSchema = z
    .string()
    .email({ message: "Please enter a valid email address." });
  const handleAddInvitee = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") return;
    setInputValue("");

    try {
      emailSchema.parse(trimmedValue);
      setInvitees((prev) => [...prev, trimmedValue]);
      setInputValue("");
      setErrors("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors[0].message);
      }
    }
  };

  const handleSubmit = async () => {
    // invitees
    toast.loading("Sending invitation...");
    const data = await fetcher(`/api/team/invite/${teamId}`, {
      body: JSON.stringify({
        emailIds: invitees,
        teamId,
      }),
      method: "POST",
    })
      .then((data) => {
        console.log("data in then: ", data);
        toast.success("Invitation sent successfully.");
      })
      .catch((err) => {
        console.log("data in catch: ", err);
        toast.error("Error while sending invitation.");
      });
    toast.dismiss();
    setIsOpen(false);
    console.log("data: ", data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setInvitees([]);
        setErrors("");
      }}
    >
      <DialogContent className="border-sidebar-border">
        <DialogHeader>
          <DialogTitle>Add Invitee's Email</DialogTitle>
          <DialogDescription className="pb-4">
            This will send an invitation to the invitee's email which will
            expire within 2 minutes.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Invitee's email"
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddInvitee();
                }
              }}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              className="border-sidebar-border focus:ring-2 ring-bor"
            />
            <p className="text-sm text-destructive pl-1">{errors}</p>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {invitees.map((data, index) => (
                <Badge
                  className="bg-sidebar-border text-sidebar-accent-foreground hover:bg-sidebar-border gap-1 p-1 px-3 rounded-lg border border-neutral-5 truncate"
                  key={index}
                >
                  {data}
                  <X
                    size={14}
                    className="shrink-0"
                    onClick={() => {
                      setInvitees((prev) =>
                        prev.filter((value) => value !== data)
                      );
                    }}
                  />
                </Badge>
              ))}
            </div>
            <Button
              type="button"
              disabled={!invitees.length ? true : false}
              onClick={() => handleSubmit()}
              className=""
            >
              <span>Invite</span>
              <Send />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"default"}>
          <Users />
          <p>Invite members</p>
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
