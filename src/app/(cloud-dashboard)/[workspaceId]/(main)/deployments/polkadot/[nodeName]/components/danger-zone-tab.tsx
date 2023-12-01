"use client";

import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";
import { AlertModal } from "@/components/modals/alert-modal";
import { TabsFooter } from "@/components/ui/tabs";

interface DangerZoneTabProps {
  node: PolkadotNode;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const { workspaceId } = useParams();

  return (
    <div>
      <p className="text-muted-foreground">
        By deleting this node, all connected apps will lose access to the
        Blockchain Network.
      </p>
      <p className="text-muted-foreground">
        Node attached volume that persists Blockchain data will not be removed,
        you need to delete it yourself.
      </p>
      <p className="text-muted-foreground">
        Are you sure you want to delete this node?
      </p>
      <TabsFooter>
        <AlertModal triggerText="Delete Node" title="Delete Polkadot Node">
          <DeleteWithInputForm
            name={node.name}
            url={`/polkadot/nodes/${node.name}`}
            redirectUrl={`/${workspaceId}/deployments/polkadot`}
          />
        </AlertModal>
      </TabsFooter>
    </div>
  );
};
