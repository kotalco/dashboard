import { Sidebar } from "@/components/sidebar";
import { ManagedSettingsNavigationItems } from "@/components/ui/managed-settings-navigation-items";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <ManagedSettingsNavigationItems />
      </Sidebar>
      <main className="container flex-1 max-h-screen pt-10 pb-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
