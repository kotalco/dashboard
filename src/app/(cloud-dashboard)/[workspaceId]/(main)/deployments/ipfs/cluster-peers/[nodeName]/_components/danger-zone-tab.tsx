"use client";

import { useParams } from "next/navigation";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";

import { AlertModal } from "@/components/modals/alert-modal";

import { IPFSClusterPeer } from "@/types";

interface DangerZoneTabProps {
  node: IPFSClusterPeer;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const { workspaceId } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-muted-foreground">
          By deleting this peer, all connected apps will lose access to the
          Blockchain Network.
        </p>
        <p className="text-muted-foreground">
          Peer attached volume that persists Blockchain data will not be
          removed, you need to delete it yourself.
        </p>
        <p className="text-muted-foreground">
          Are you sure you want to delete this peer?
        </p>
      </div>
      <AlertModal triggerText="Delete Peer" title="Delete Cluster Peer">
        <DeleteWithInputForm
          name={node.name}
          url={`/ipfs/clusterpeers/${node.name}?workspace_id=${workspaceId}`}
          redirectUrl={`/${workspaceId}/deployments/ipfs?tab=cluster-peers`}
        />
      </AlertModal>
    </div>
  );
};
