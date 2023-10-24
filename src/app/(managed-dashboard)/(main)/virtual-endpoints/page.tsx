import { format, parseISO } from "date-fns";

import { EndpointsClient } from "./components/client";
import { getVirtualEndpoints } from "@/services/get-virtual-endpoints";

export default async function EndpointsPage() {
  const { data } = await getVirtualEndpoints();

  const formattedEndpoints = data.map(({ protocol, name, created_at }) => ({
    protocol,
    name,
    created_at: format(parseISO(created_at), "MMMM do, yyyy"),
    href: `/virtual-endpoints/${name}`,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <EndpointsClient data={formattedEndpoints} />
      </div>
    </div>
  );
}
