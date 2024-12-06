import {
  Sidebar,
  SidebarFooter,
} from "@/app/components/ui/sidebar";

import Avatar from "./Avatar";
import ClientSidebarContent from "./ClientSidebarContent";



export function AppSidebar() {
  return (
    <Sidebar className="">
      <ClientSidebarContent />
      <SidebarFooter className="px-3">
        <div className="border-t border-sidebar-border w-full h-fit rounded-none py-2 flex items-center">
          <Avatar />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
