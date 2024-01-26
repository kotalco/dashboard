import { redirect } from "next/navigation";

import { findUser } from "@/services/find-user";
import { getCounts } from "@/services/get-counts";

import { MainNavigationItems } from "@/components/main-navigation-items";
import { Sidebar } from "@/components/sidebar";
import { CloudActions } from "@/components/shared/command-actions/cloud-actions";

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
        <CloudActions />
        <MainNavigationItems counts={count} />
      </Sidebar>
      <div className="flex flex-col flex-1 w-0 min-h-screen ml-64 overflow-y-auto">
        <main
          className="flex-1 focus:outline-none h-full max-w-7xl p-4 sm:p-6 md:p-10"
          tabIndex={0}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
