import { getNodes } from "@/services/get-nodes";
import { IPFSPeer } from "@/types";

import { Count } from "@/components/ui/count";

interface PeersTriggerTabProps {
  workspaceId: string;
}

export const PeersTriggerTab = async ({
  workspaceId,
}: PeersTriggerTabProps) => {
  const { count } = await getNodes<IPFSPeer>(workspaceId, "/ipfs/peers");

  return (
    <>
      Peers
      {!!count && <Count count={count} />}
    </>
  );
};
