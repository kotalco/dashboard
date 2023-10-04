import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { NEARNode } from "@/types";
import { NEARClient } from "./components/client";

export default async function NEARPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<NEARNode>(params.workspaceId, "/near/nodes");
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <NEARClient data={data} role={role} />
      </div>
    </div>
  );
}
