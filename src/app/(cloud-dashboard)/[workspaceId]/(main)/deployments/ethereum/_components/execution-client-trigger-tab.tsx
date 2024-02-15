import { getNodes } from "@/services/get-nodes";
import { ExecutionClientNode } from "@/types";

import { Count } from "@/components/ui/count";

interface ExecutionClientTriggerTabProps {
  workspaceId: string;
}

export const ExecutionClientTriggerTab = async ({
  workspaceId,
}: ExecutionClientTriggerTabProps) => {
  const { count } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );

  return (
    <>
      Execution Client Nodes
      {!!count && <Count count={count} />}
    </>
  );
};
