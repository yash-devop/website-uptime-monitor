import { auth } from "@/utils/auth";
import Navbar from "./components/Navbar";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ChangelogBanner from "./components/ChangelogBanner";
export default async function Home() {
  const session = await auth();

  return (
    <>
      <div className="h-full min-h-screen w-full">
        <ChangelogBanner changelog="Some features are on the way, still you can use the basic monitoring service."/>
        <Navbar />
        <div className="bg-green-2 h-[300px] md:h-[330px] md:w-[400px] absolute top-0 left-0 right-0 m-auto z-[-1] rounded-bl-full rounded-br-full blur-[180px]" />
        <div className="max-w-[1200px] mx-auto px-3">
          <p className="text-3xl sm:text-4xl md:text-5xl text-center pt-32 text-white max-w-[420px] sm:max-w-[530px] md:max-w-[800px] mx-auto drop-shadow-2xl">
            Stay ahead of <span className="text-green-2">downtime</span> with{" "}
            <span className="">Control's</span> Realtime{" "}
            <span className="text-green-2">Monitoring</span>
          </p>
          <p className="text-neutral-1 max-w-[550px] text-center mx-auto py-8">
            With real-time insights and instant alerts, we help you stay
            proactive, minimizing downtime and keeping your digital experiences
            seamless and reliable.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Button className="h-9" variant={"default"}>
              <Link href={session && session.user ? "/dashboard/team/monitor" : "/signin"}>
                {session && session.user ? (
                  <p className="flex items-center justify-between gap-2">Go to Dashboard <ArrowRight /></p>
                ) : (
                  <p>Get started with an account</p>
                )}
              </Link>
            </Button>
            <Button asChild className="h-9" variant={"outline"}>
              <Link href={"/pricing"}>
                <p>Pricing</p>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}