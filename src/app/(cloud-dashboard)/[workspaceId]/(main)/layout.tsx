import { redirect } from "next/navigation";

import { MainNavigationItems } from "@/components/main-navigation-items";
import { Sidebar } from "@/components/sidebar";
import { findUser } from "@/services/find-user";
import { getCounts } from "@/services/get-counts";

export default async function DashboardLayout({
  children,
  params: { workspaceId },
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const { user } = await findUser();
  if (!user) redirect("/sign-in");

  const { count } = await getCounts(workspaceId);

  return (
    <div className="flex overflow-hidden">
      <Sidebar>
        <MainNavigationItems counts={count} />
      </Sidebar>
      <div className="flex flex-col flex-1 w-0 min-h-screen ml-64 overflow-y-auto">
        <main className="flex-1 py-10 focus:outline-none" tabIndex={0}>
          <div className="h-full px-4 max-w-7xl sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
