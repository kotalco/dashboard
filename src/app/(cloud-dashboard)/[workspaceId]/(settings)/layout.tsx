import { SettingsNavigationItems } from "@/components/settings-navigation-items";
import { CloudActions } from "@/components/shared/command-actions/cloud-actions";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <CloudActions />
        <SettingsNavigationItems />
      </Sidebar>
      <main className="flex-1 ml-64 max-h-screen max-w-7xl p-4 sm:p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
