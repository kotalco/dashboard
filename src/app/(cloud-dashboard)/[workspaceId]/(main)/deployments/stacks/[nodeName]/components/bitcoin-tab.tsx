"use client";

import { useParams } from "next/navigation";

import { BitcoinNode, StacksNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editBitcoin } from "@/actions/edit-stacks";

import { Select } from "@/components/form/select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface BitconTabProps {
  node: StacksNode;
  bitcoinNodes: BitcoinNode[];
  role: Roles;
}

export const BitconTab: React.FC<BitconTabProps> = ({
  node,
  role,
  bitcoinNodes,
}) => {
  const { bitcoinNode, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editBitcoin);

  const nodes = bitcoinNodes
    .filter(({ rpc }) => rpc)
    .map((node) => ({ label: node.name, value: JSON.stringify(node) }));

  const defaultNode = JSON.stringify(
    bitcoinNodes.find(({ name }) => bitcoinNode.endpoint === name)
  );

  const onSubmit = (formData: FormData) => {
    const bitcoinNode = formData.get("bitcoinNode") as string;
    execute({ bitcoinNode }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="bitcoinNode"
        label="Bitcoin Node"
        placeholder="Select a Node"
        options={nodes}
        errors={fieldErrors}
        description="Bitcoin nodes with JSON-RPC server enabled"
        disabled={role === Roles.Reader}
        defaultValue={defaultNode}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Bitcoin settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
