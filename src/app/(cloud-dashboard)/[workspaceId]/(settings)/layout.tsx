import { SettingsNavigationItems } from "@/components/settings-navigation-items";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SettingsNavigationItems />
      </Sidebar>
      <main className="container flex-1 ml-64 max-h-screen py-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
