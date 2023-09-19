import { getWorkspace } from "@/services/get-workspace";
import { BitcoinClient } from "./components/client";
import { getNodes } from "@/services/get-nodes";
import { BitcoinNode } from "@/types";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const nodes = await getNodes<BitcoinNode>(
    params.workspaceId,
    "/bitcoin/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BitcoinClient data={nodes} role={role} />
      </div>
    </div>
  );
}
