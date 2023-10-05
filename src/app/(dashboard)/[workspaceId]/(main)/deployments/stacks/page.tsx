import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { StacksNode } from "@/types";
import { StacksClient } from "./components/client";

export default async function StacksPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data } = await getNodes<StacksNode>(
    params.workspaceId,
    "/stacks/nodes"
  );
  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <StacksClient data={data} role={role} />
      </div>
    </div>
  );
}
