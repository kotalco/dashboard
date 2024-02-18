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
      <main className="container ml-64 flex-1 max-h-screen max-w-7xl p-4 sm:p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
