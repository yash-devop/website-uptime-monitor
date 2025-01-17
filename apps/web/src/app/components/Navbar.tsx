import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/utils/auth";
import { Control } from "./icons/Control";

export default async function Navbar(){
    const session = await auth();
    return (
        <>
            <header className="h-14 bg-sred-400 flex items-center justify-between w-full border-b border-neutral-6 bg-black-1/65 backdrop-blur-sm text-sm px-8">
                <nav className="max-w-[1200px] mx-auto flex items-center justify-between w-full text-white">
                    <div>
                        <Control 
                            variant="sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild variant={"outline"} size={"xs"} className="text-neutral-2 hover:text-white">
                            <Link href={"/signin"}>
                                <p>Sign in</p>    
                            </Link>
                        </Button>
                        {
                            session && session.user ? (
                                <Button asChild variant={"default"} size={"xs"} className="">
                                    <Link href={"/dashboard/team/monitor"}>
                                        <p>Dashboard</p>    
                                    </Link>
                                </Button>
                            ) : null
                        }
                    </div>
                </nav>
            </header>
        </>
    )
}