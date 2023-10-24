import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { FilecoinNode } from "@/types";
import { FilecoinClient } from "./components/client";

export default async function FilecoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<FilecoinNode>(
    params.workspaceId,
    "/filecoin/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <FilecoinClient data={data} role={role} />
      </div>
    </div>
  );
}
