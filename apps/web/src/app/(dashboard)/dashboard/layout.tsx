import { AppSidebar } from "@/app/components/AppSidebar";
import ClientSideTriggerButton from "@/app/components/ClientSideTriggerButton";
import { SidebarProvider } from "@/app/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen h-full w-full overflow-auto">
      <SidebarProvider>
        <AppSidebar/>
        {/* <AppSidebar pathname={pathname} teamId={teamSlug}/> */}
        <main className="w-full overflow-auto">
          <div className="p-2">
            <ClientSideTriggerButton />
          </div>
          <div className="w-full">
            <div className="py-8 px-6 md:py-10 md:px-14 lg:px-20">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
