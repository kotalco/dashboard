import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { AptosNode } from "@/types";
import { AptosClient } from "./components/client";

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<AptosNode>(
    params.workspaceId,
    "/aptos/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <AptosClient data={data} role={role} />
      </div>
    </div>
  );
}
