import { getVirtualEndpointsCount } from "@/services/get-virtual-endpoints-count";

import { ManagedNavigationItems } from "@/components/managed-navigation-items";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { count } = await getVirtualEndpointsCount();
  return (
    <div className="flex overflow-hidden">
      <Sidebar>
        <ManagedNavigationItems endpointCount={count} />
      </Sidebar>
      <div className="flex flex-col ml-64 flex-1 w-0 min-h-screen overflow-y-auto">
        <main
          className="flex-1 h-full focus:outline-none max-w-7xl p-4 sm:p-6 md:p-10"
          tabIndex={0}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
