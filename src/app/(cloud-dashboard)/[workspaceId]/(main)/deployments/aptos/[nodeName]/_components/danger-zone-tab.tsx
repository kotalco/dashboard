"use client";

import { useParams } from "next/navigation";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";
import { AlertModal } from "@/components/modals/alert-modal";

import { AptosNode } from "@/types";

interface DangerZoneTabProps {
  node: AptosNode;
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
      </div>
      <AlertModal triggerText="Delete Node" title="Delete Aptos Node">
        <DeleteWithInputForm
          name={node.name}
          url={`/aptos/nodes/${node.name}?workspace_id=${workspaceId}`}
          redirectUrl={`/${workspaceId}/deployments/aptos`}
        />
      </AlertModal>
    </div>
  );
};
