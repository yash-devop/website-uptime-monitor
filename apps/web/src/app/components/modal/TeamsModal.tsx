"use client"
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

export default function TeamsModal() {
  const [invitees, setInvitees] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddInvitee = () => {
    if (inputValue.trim() !== "") {
      setInvitees((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    // invitees
    e.preventDefault();
    console.log('invitees',invitees);
  }
  
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="border-sidebar-border">
        <DialogHeader>
          <DialogTitle>Add Invitee's Email</DialogTitle>
          <DialogDescription className="pb-4">
            This will send an invitation to the invitee's email which will expire within 2 minutes.
          </DialogDescription>
          <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col gap-4">
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
              className="border-sidebar-border focus:ring-2 ring-red-400"
            />
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {invitees.map((data, index) => (
                <Badge className="bg-sidebar-border text-sidebar-accent-foreground hover:bg-sidebar-border gap-1 p-1 px-3 rounded-lg border border-neutral-5 truncate" key={index}>
                    {data}
                    <X size={14} className="shrink-0" onClick={()=>{
                        setInvitees((prev)=>prev.filter((value)=>value !== data))
                    }}/>
                </Badge>
              ))}
            </div>
            <Button type="submit" onClick={() => setIsOpen(false)} className="">
              <span>Invite</span>
              <Send />
            </Button>
          </form>
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
