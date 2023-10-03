"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";

import { AlertModal } from "@/components/modals/alert-modal";
import { DeleteNodeForm } from "@/components/delete-node-form";
import { useToast } from "@/components/ui/use-toast";
import { TabsFooter } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExecutionClientNode } from "@/types";
import { client } from "@/lib/client-instance";

interface DangerZoneTabProps {
  node: ExecutionClientNode;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ node }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  async function onDeleteExecutionClientNode() {
    const url = qs.stringifyUrl({
      url: `/ethereum/nodes/${node.name}`,
      query: { workspace_id: params.workspaceId },
    });
    await client.delete(url);
    router.push(
      `/${params.workspaceId}/deployments/ethereum?deployment=execution-clients`
    );
    router.refresh();
    toast({
      title: "Execution client node has been deleted",
      description: `${node.name} node has been deleted successfully.`,
    });
    setOpen(false);
  }

  return (
    <>
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
        <TabsFooter>
          <Button
            variant="destructive"
            className="btn btn-alert"
            onClick={() => setOpen(true)}
          >
            Delete Node
          </Button>
        </TabsFooter>
      </div>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Execution Client Node"
        description={`This action cann't be undone. This will permnantly delete (${node.name}) Execution Client Node.`}
      >
        <DeleteNodeForm
          nodeName={node.name}
          onDelete={onDeleteExecutionClientNode}
        />
      </AlertModal>
    </>
  );
};
