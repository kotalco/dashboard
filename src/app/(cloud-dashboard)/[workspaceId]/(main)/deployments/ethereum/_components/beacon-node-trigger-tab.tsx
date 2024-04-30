import { getNodes } from "@/services/get-nodes";
import { BeaconNode } from "@/types";

import { Count } from "@/components/ui/count";

interface BeaconNodeTriggerTabProps {
  workspaceId: string;
}

export const BeaconNodeTriggerTab = async ({
  workspaceId,
}: BeaconNodeTriggerTabProps) => {
  const { count } = await getNodes<BeaconNode>(
    workspaceId,
    "/ethereum2/beaconnodes"
  );
  return (
    <>
      Beacon Nodes
      {!!count && <Count count={count} />}
    </>
  );
};
