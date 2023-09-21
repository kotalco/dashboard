import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { BitcoinNode } from "@/types";
import { BitcoinClient } from "./components/client";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<BitcoinNode>(
    params.workspaceId,
    "/bitcoin/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BitcoinClient data={data} role={role} />
      </div>
    </div>
  );
}
