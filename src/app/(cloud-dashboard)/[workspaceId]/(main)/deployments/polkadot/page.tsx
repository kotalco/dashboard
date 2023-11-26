import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { PolkadotNode } from "@/types";
import { PolkadotClient } from "./components/client";

export default async function PolkadotPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<PolkadotNode>(
    params.workspaceId,
    "/polkadot/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <PolkadotClient data={data} role={role} />
      </div>
    </div>
  );
}
