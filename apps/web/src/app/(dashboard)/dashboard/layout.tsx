import { AppSidebar } from "@/app/components/AppSidebar";
import ClientSideTriggerButton from "@/app/components/ClientSideTriggerButton";
import { SidebarProvider } from "@/app/components/ui/sidebar";
import BreadcrumbSlot from "@/app/components/BreadcrumbSlot";
import { cookies, headers } from "next/headers";

type BreadcrumbElements = { [key: string]: { label: string; url: string }[] };


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const BREADCRUMB_HEADER_HEIGHT = "45px"
  const cookieStore = cookies()
  const teamSlug = cookieStore.get("team-slug")?.value
  const pathname = headers().get("x-current-path")!;

  const teamRoute = '/dashboard/team';
  const breadcrumbConfig: BreadcrumbElements = {
    "^/dashboard/team/[\\w-]+/monitors/create$": [
      { label: "Monitors", url: `${teamRoute}/${teamSlug}/monitors` },
      { label: "Create Monitor", url: `${teamRoute}/${teamSlug}/monitors/create` },
    ],
    "^/dashboard/team/[\\w-]+/incidents$": [
      { label: "Dashboard", url: "/dashboard" },
      { label: "Incidents", url: `${teamRoute}/${teamSlug}/incidents` },
    ],
    "^/dashboard/team/[\\w-]+/status$": [
      { label: "Dashboard", url: "/dashboard" },
      { label: "Status", url: `${teamRoute}/${teamSlug}/status` },
    ],
  };
  const breadcrumbItems = Object.keys(breadcrumbConfig).reduce(
    (matchedItems, pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname) ? breadcrumbConfig[pattern] : matchedItems;
    },
    undefined as { label: string; url: string }[] | undefined
  );

  console.log('breadcrumbItems',breadcrumbItems);
  return (
    <div className="min-h-screen h-full w-full overflow-auto">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="p-2">
            <ClientSideTriggerButton />
          </div>
          <div className="w-full">
            {
              typeof(breadcrumbItems) !== "undefined" ? (
                <div style={{
                  height: BREADCRUMB_HEADER_HEIGHT
                }} className="my-3 w-full border-b border-sidebar-border px-4 overflow-x-auto">
                  <BreadcrumbSlot elements={breadcrumbItems} />
                </div>
              ) : null
            }
            <div className="py-8 px-6 md:py-10 md:px-20">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
