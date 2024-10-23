"use client"
// import { signIn } from "@/utils/auth";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react"
export default function Home() {
  const {data} = useSession()
  return (
    <>
  
      <button type="button" onClick={async()=>await signIn("google")}>Signin with Google</button>
      <button type="button" onClick={async()=>await signIn("github")}>Signin with Github ?</button>
      {
        JSON.stringify(data?.user)
      }
    </>

  );
}
