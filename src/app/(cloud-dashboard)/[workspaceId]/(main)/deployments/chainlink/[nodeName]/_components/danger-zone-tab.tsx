"use client";

import { useParams } from "next/navigation";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";
import { AlertModal } from "@/components/modals/alert-modal";

import { ChainlinkNode } from "@/types";

interface DangerZoneTabProps {
  node: ChainlinkNode;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const { workspaceId } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-muted-foreground">
          By deleting this node, all connected apps will lose access to the
          Blockchain Network.
        </p>
        <p className="text-muted-foreground">
          Node attached volume that persists Blockchain data will not be
          removed, you need to delete it yourself.
        </p>
        <p className="text-muted-foreground">
          Are you sure you want to delete this node?
        </p>
      </div>
      <AlertModal triggerText="Delete Node" title="Delete Chainlink Node">
        <DeleteWithInputForm
          name={node.name}
          url={`/chainlink/nodes/${node.name}?workspace_id=${workspaceId}`}
          redirectUrl={`/${workspaceId}/deployments/chainlink`}
        />
      </AlertModal>
    </div>
  );
};
