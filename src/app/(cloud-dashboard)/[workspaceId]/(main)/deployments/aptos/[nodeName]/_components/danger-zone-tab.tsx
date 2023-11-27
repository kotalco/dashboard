"use client";

import { useParams } from "next/navigation";

import { DeleteNodeForm } from "@/components/delete-node-form";
import { TabsFooter } from "@/components/ui/tabs";
import { AlertModal } from "@/components/modals/alert-modal";

import { AptosNode } from "@/types";

interface DangerZoneTabProps {
  node: AptosNode;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const params = useParams();

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
        <AlertModal triggerText="Delete Node" title="Delete Aptos Node">
          <DeleteNodeForm
            nodeName={node.name}
            url={`/aptos/nodes/${node.name}`}
            redirectUrl={`/${params.workspaceId}/deployments/aptos`}
          />
        </AlertModal>
      </TabsFooter>
    </div>
  );
};