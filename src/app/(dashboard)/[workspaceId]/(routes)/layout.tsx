import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { MainSidebarContent } from "@/components/main-sidebar-content";
import { Sidebar } from "@/components/sidebar";
import { StorageItems } from "@/enums";
import { api } from "@/lib/axios";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (!token?.value) return null;

  const config = {
    headers: { Authorization: `Bearer ${token.value}` },
  };

  try {
    await api.get(`/workspaces/${params.workspaceId}`, config);
  } catch (error) {
    notFound();
  }

  return (
    <div className="flex overflow-hidden">
      <Sidebar>
        <MainSidebarContent />
      </Sidebar>
      <div className="flex flex-col flex-1 w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 pt-10 focus:outline-none" tabIndex={0}>
          <div className="h-full px-4 py-6 mx-auto max-w-7xl sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
