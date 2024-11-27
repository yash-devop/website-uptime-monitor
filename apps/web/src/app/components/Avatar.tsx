import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { auth } from "@/utils/auth";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { VariantProps } from "class-variance-authority";
import { CreditCard, LogOut, Settings } from "lucide-react";
import ClientSideLogoutButton from "./ClientSideLogoutButton";
import {prisma} from "@repo/db";
import { generateUrlWithTeamId } from "./AppSidebar";

type ElementProps = {
  name: string;
  icon?: React.ReactElement;
  url: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}[];
type DropdownElementProps = {
  [key: string]: ElementProps;
};
type ModifiedTeam = {
  name: string;
  variant: VariantProps<typeof buttonVariants>["variant"];
  url: string;
}[];

export default async function Avatar() {
  const session = await auth();
  const user = session?.user;
  const userImage = user?.image;
  const userName = user?.name || "Anonymous";
  const userEmail = user?.email || "No email available";

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId: user?.id! },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
  const revampedTeams: ModifiedTeam = teams.map((team) => {
    return {
      name: team.teamName,
      variant: "ghost",
      url: generateUrlWithTeamId("/monitors", team.id),
    };
  });
  console.log("teams", revampedTeams);

  const allElements: DropdownElementProps = {
    quickAccess: revampedTeams,
    payments: [
      { name: "Billing", variant: "ghost", icon: <CreditCard />, url: "#" },
    ],
    account: [
      {
        name: "Settings",
        variant: "ghost",
        icon: <Settings />,
        url: "/settings",
      },
      { name: "Sign out", variant: "destructive", icon: <LogOut />, url: "" },
    ],
  };
  // const allElements: DropdownElementProps = {
  //   quickAccess: [
  //     { name: "Team Valo", variant: "ghost" , url: "#" },
  //     { name: "Team Real", variant: "ghost", url: "#" },
  //   ],
  //   payments: [{ name: "Billing", variant: "ghost", icon: <CreditCard /> , url: "#" }],
  //   account: [
  //     { name: "Settings", variant: "ghost", icon: <Settings />  , url: "/settings"},
  //     { name: "Sign out", variant: "destructive", icon: <LogOut /> , url: "" },
  //   ],
  // };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none hover:bg-sidebar-border w-full p-2 rounded-md transition-all duration-150">
          {userImage ? (
            <div className="w-fit flex items-center gap-2">
              <div className="bg-green-2 p-[2.5px] rounded-full shrink-0 size-9">
                <Image
                  src={userImage}
                  className="rounded-full shadow-sm border border-black-1"
                  width={40}
                  height={40}
                  alt="User Profile"
                />
              </div>
              <div className=" [&>p]:text-left truncate w-fit">
                <p className="text-white font-medium text-sm">{userName}</p>
                <div className="max-w-[180px] w-full truncate">
                  <span className="text-xs">{userEmail}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 rounded-full w-10 h-10">
              <span className="text-slate-700 font-bold">UN</span>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          alignOffset={40}
          align="start"
          className="w-[320px] bg-black-4 text-white border-sidebar-border pt-4"
        >
          <MenuSection elements={allElements.quickAccess} className="pb-4">
            <DropdownSection sectionName="QUICK ACCESS" />
          </MenuSection>
          <MenuSection elements={allElements.payments}>
            <DropdownSection sectionName="PAYMENTS" />
          </MenuSection>
          <MenuSection elements={allElements.account} className="pb-2">
            <DropdownSection sectionName="ACCOUNT" />
          </MenuSection>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const DropdownHeader = ({
  heading,
  sectionClassName,
}: {
  heading: string;
  sectionClassName?: React.HTMLAttributes<HTMLElement>["className"];
}) => {
  return (
    <p
      className={cn(
        `font-mono text-xs font-extralight px-1 text-green-1`,
        sectionClassName
      )}
    >
      {heading}
    </p>
  );
};

const DropdownSection = ({
  sectionName,
  className,
  sectionClassName,
}: {
  sectionName: string;
  className?: string;
  sectionClassName?: React.HTMLAttributes<HTMLElement>["className"];
}) => {
  return (
    <>
      <div className={cn(`border-b border-sidebar-border pb-4`, className)}>
        <DropdownHeader
          heading={sectionName}
          sectionClassName={sectionClassName}
        />
      </div>
    </>
  );
};

const MenuSection = ({
  elements,
  className,
  children,
}: {
  elements: ElementProps;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <DropdownMenuLabel
      className={cn(`w-full flex flex-col gap-1 pb-4`, className)}
    >
      {children}
      {elements.map((element) => (
        <DropdownMenuItem asChild className="p-0 focus:bg-sidebar-accent border-none outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:text-white text-neutral-2 hover:text-white cursor-pointer">
          <Button
            asChild
            variant={element.variant}
            className={cn(
              `w-full border-none text-left justify-start text-sm hover:bg-sidebar-border ring-0 ring-offset-0 text-neutral-2 hover:text-white`,
              element.variant === "destructive" &&
                "bg-black-4 text-neutral-2  hover:bg-destructive"
            )}
          >
            {element.name === "Sign out" ? (
              <ClientSideLogoutButton />
            ) : (
              <Link href={element.url} className="flex items-center gap-2">
                {element.icon}
                <span>{element.name}</span>
              </Link>
            )}
          </Button>
        </DropdownMenuItem>
      ))}
    </DropdownMenuLabel>
  );
};
