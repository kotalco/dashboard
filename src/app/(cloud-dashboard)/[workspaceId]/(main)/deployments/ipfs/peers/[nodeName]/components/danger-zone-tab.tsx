"use client";

import { useParams } from "next/navigation";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";
import { TabsFooter } from "@/components/ui/tabs";
import { AlertModal } from "@/components/modals/alert-modal";

import { IPFSPeer } from "@/types";

interface DangerZoneTabProps {
  node: IPFSPeer;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const { workspaceId } = useParams();

  return (
    <div>
      <p className="text-muted-foreground">
        By deleting this peer, all connected apps will lose access to the
        Blockchain Network.
      </p>
      <p className="text-muted-foreground">
        Peer attached volume that persists Blockchain data will not be removed,
        you need to delete it yourself.
      </p>
      <p className="text-muted-foreground">
        Are you sure you want to delete this peer?
      </p>
      <TabsFooter>
        <AlertModal triggerText="Delete Peer" title="Delete IPFS Peer">
          <DeleteWithInputForm
            name={node.name}
            url={`/ipfs/peers/${node.name}`}
            redirectUrl={`/${workspaceId}/deployments/ipfs?deployment=peers`}
          />
        </AlertModal>
      </TabsFooter>
    </div>
  );
};
