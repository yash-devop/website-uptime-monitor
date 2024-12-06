"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
        {/* Don't know if there is any security issue */}
        <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>        {/* refetchOnWindowFocus is when you switch the tab and again go back to that tab.*/}
    </>
  );
}
