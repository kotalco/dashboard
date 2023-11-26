import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { ChainlinkNode } from "@/types";
import { ChainlinkClient } from "./components/client";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<ChainlinkNode>(
    params.workspaceId,
    "/chainlink/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ChainlinkClient data={data} role={role} />
      </div>
    </div>
  );
}
