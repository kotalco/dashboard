import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { EndpointsClient } from "./components/client";
import { getEndpoints } from "@/services/get-endpoints";

export default async function EndpointsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getEndpoints(params.workspaceId);
  const { role } = await getWorkspace(params.workspaceId);
  const formattedEndpoints = data.map(({ protocol, name, created_at }) => ({
    protocol,
    name,
    created_at: format(parseISO(created_at), "MMMM do, yyyy"),
    href: `/${params.workspaceId}/endpoints/${name}`,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <EndpointsClient data={formattedEndpoints} role={role} />
      </div>
    </div>
  );
}
