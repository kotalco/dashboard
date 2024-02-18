import { getNodes } from "@/services/get-nodes";
import { IPFSClusterPeer } from "@/types";

import { Count } from "@/components/ui/count";

interface ClusterPeersTriggerTabProps {
  workspaceId: string;
}

export const ClusterPeersTriggerTab = async ({
  workspaceId,
}: ClusterPeersTriggerTabProps) => {
  const { count } = await getNodes<IPFSClusterPeer>(
    workspaceId,
    "/ipfs/clusterpeers"
  );

  return (
    <>
      Cluster Peers
      {!!count && <Count count={count} />}
    </>
  );
};
