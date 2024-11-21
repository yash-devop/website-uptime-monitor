import {
  Calendar,
  Activity,
  Inbox,
  LogOut,
  Search,
  Settings,
  Siren,
  Layers3,
  Vibrate,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/app/components/ui/sidebar";
import { Control } from "./icons/Control";
import { headers } from "next/headers";
import { Separator } from "./ui/separator";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

export function generateUrlWithTeamId(path: string, teamId: string) {
  return `/dashboard/team/${teamId}${path}`;
}

export function AppSidebar() {
  const headerList = headers();
  const pathname = headerList.get("x-current-path") as string;
  console.log("pathname in Sidebar: ", pathname);
  const teamId = pathname.split("/")[3];

  const items = [
    {
      title: "Monitors",
      url: generateUrlWithTeamId("/monitors", teamId),
      icon: Activity,
    },
    {
      title: "Incidents",
      url: generateUrlWithTeamId("/incidents", teamId),
      icon: Siren ,
    },
    {
      title: "Status Pages",
      url: generateUrlWithTeamId("/status", teamId),
      icon: Layers3,
    },
    {
      title: "Notifications",
      url: generateUrlWithTeamId("/notifications", teamId),
      icon: Vibrate,
    },
    {
      title: "Teams",
      url: "#",
      icon: Users,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  console.log("Path in Sidebar : ", pathname);
  return (
    <Sidebar className="">
      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="[&>svg]:size-auto py-8 justify-between">
            <Control variant="sm" className="text-green-2 pl-1" />
          </SidebarGroupLabel>
          <Separator className="mb-2" />
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = new RegExp(`^${item.url}`).test(pathname);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      asChild
                      className={cn(`py-5 px-3 [&>svg]:size-auto  transition-all duration-150`,isActive && 'border border-sidebar-border shadow-sm shadow-neutral-6/40')}
                    >
                      <a href={item.url} className={cn(`text-sm`,isActive && 'text-green-2 [&>svg]:text-green-1')}>
                        <item.icon size={17}/>
                        <span className={'text-sm'}>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3">
        <div className="border-t border-sidebar-border w-full h-fit rounded-none py-2 flex items-center">
            <Avatar />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
