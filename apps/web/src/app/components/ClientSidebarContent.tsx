"use client";
import Link from "next/link";
import { Control } from "./icons/Control";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Activity,
  Siren,
  Layers3,
  Vibrate,
  Users,
} from "lucide-react";

export function generateUrlWithTeamId(path: string, teamId: string) {
  return `/dashboard/team/${teamId}${path}`;
}
export default function ClientSidebarContent() {
  const currentPathname = usePathname();
  const teamId = currentPathname.split("/")[3];
  const items = [
    {
      title: "Monitors",
      url: generateUrlWithTeamId("/monitors", teamId),
      icon: Activity,
    },
    {
      title: "Incidents",
      url: generateUrlWithTeamId("/incidents", teamId),
      icon: Siren,
    },
    {
      title: "Status Pages",
      url: generateUrlWithTeamId("/status", teamId),
      icon: Layers3,
      coming_soon: true
    },
    {
      title: "Notifications",
      url: generateUrlWithTeamId("/notifications", teamId),
      icon: Vibrate,
      coming_soon: true
    },
    {
      title: "Teams",
      url: generateUrlWithTeamId("/teams", teamId),
      icon: Users,
    }
  ];

  return (
    <>
      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="[&>svg]:size-auto py-8 justify-between">
            <Control variant="sm" className="text-green-2 pl-1" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = new RegExp(`^${item.url}`).test(
                  currentPathname
                );
                console.log("isActive", isActive);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      asChild
                      className={cn(
                        `py-5 px-3 [&>svg]:size-auto transition-all duration-300 border border-transparent`,
                        isActive &&
                          "border-sidebar-border shadow-sm shadow-neutral-6/40"
                      )}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          `text-sm flex items-center justify-between`,
                          isActive && " [&>svg]:text-green-1"
                        )}
                      >
                        <div className={`flex items-center gap-2 ${isActive && "[&>svg]:text-green-1"}`}>
                          <item.icon size={17} />
                          <span className={"text-sm"}>{item.title}</span>
                        </div>
                        {
                          item.coming_soon ? (
                            <div className="bg-neutral-7 text-xs border border-neutral-6 text-neutral-4 p-1 rounded-md">
                              <span>coming soon</span>
                            </div>
                          ) : null
                        }
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
