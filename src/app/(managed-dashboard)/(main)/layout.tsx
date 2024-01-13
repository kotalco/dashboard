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
      <div className="flex flex-col flex-1 w-0 min-h-screen overflow-y-auto">
        <main className="flex-1 pt-10 focus:outline-none" tabIndex={0}>
          <div className="h-full px-4 py-6 mx-auto sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
