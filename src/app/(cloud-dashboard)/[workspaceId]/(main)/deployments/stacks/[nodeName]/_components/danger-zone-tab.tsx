"use client";

import { useParams } from "next/navigation";

import { StacksNode } from "@/types";

import { DeleteWithInputForm } from "@/components/delete-form-with-Input";

import { AlertModal } from "@/components/modals/alert-modal";

interface DangerZoneTabProps {
  node: StacksNode;
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
      <AlertModal triggerText="Delete Node" title="Delete Stacks Node">
        <DeleteWithInputForm
          name={node.name}
          url={`/stacks/nodes/${node.name}?workspace_id=${workspaceId}`}
          redirectUrl={`/${workspaceId}/deployments/stacks`}
        />
      </AlertModal>
    </div>
  );
};
