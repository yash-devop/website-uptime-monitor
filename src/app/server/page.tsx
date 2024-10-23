import { AUTH_OPTIONS } from "@/utils/auth";
import { getSession } from "next-auth/react";
import {auth} from '@/utils/auth'
export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
        <>
            <p>Not authenticated user !</p>
        </>
    )
  }
  return <>
    <p>{JSON.stringify(session.user)}</p>
  </>;
}
