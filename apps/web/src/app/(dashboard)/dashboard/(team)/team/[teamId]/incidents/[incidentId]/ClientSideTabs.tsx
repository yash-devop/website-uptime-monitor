"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import ClientSideClipboard from "./ClientSideClipboard";
import { useRef } from "react";
export default function ClientSideTabs() {
  const clipboardRef = useRef<HTMLElement>(null);
  return (
    <>
      <div>
        <Tabs
          defaultValue="response"
          className="w-full space-y-2 transition-all"
        >
          <TabsList className="bg-neutral-7 border border-neutral-6 rounded-lg w-full justify-start">
            <TabsTrigger value="response" className="">
              Response
            </TabsTrigger>
            <TabsTrigger value="replay" className="">
              Curl Replay
            </TabsTrigger>
          </TabsList>
          <div className="rounded-md bg-neutral-7 text-sm text-neutral-2 py-6 flex items-center justify-start px-4 relative">
            <TabsContent value="response">
              495 SSL Certificate Error
            </TabsContent>
            <TabsContent value="replay" className="flex ">
              <code ref={clipboardRef} className="overflow-x-auto">
                curl -L --connect-timeout 28 --max-time 30 \ -H 'User-Agent:
                Control Control Uptime Bot Mozilla/5.0 (Windows NT 10.0; Win64;
                x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0
                Safari/537.36' \ {`https://httpstat.us/495`}
              </code>
              <ClientSideClipboard clipboardRef={clipboardRef} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
