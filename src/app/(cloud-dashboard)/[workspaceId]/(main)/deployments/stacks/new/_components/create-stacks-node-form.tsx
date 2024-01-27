"use client";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { StacksNetworks } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { BitcoinNode, Version } from "@/types";
import { useAction } from "@/hooks/use-action";
import { createStacksNode } from "@/actions/create-stacks";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { ExternalLink } from "@/components/ui/external-link";

export interface CreateStacksNodeFormProps {
  images: Version[];
  bitcoinNodes: BitcoinNode[];
}

export const CreateStacksNodeForm: React.FC<CreateStacksNodeFormProps> = ({
  images,
  bitcoinNodes,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createStacksNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/stacks`);
      toast.message("Stacks node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const nodes = bitcoinNodes
    .filter(({ rpc }) => rpc)
    .map((node) => ({ label: node.name, value: JSON.stringify(node) }));

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as StacksNetworks;
    const bitcoinNode = formData.get("bitcoinNode") as string;

    execute({
      name,
      network,
      bitcoinNode,
      workspace_id: workspaceId as string,
      image: images[0].image,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xs space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(StacksNetworks)}
        errors={fieldErrors}
      />

      <p className="text-sm flex font-medium flex-col leading-none space-y-2">
        <span>Client:</span>
        <ExternalLink href="https://github.com/stacks-network/stacks-blockchain">
          Stacks
        </ExternalLink>
      </p>

      <Select
        id="bitcoinNode"
        label="Bitcoin Node"
        placeholder="Select a Node"
        options={nodes}
        errors={fieldErrors}
        description="Bitcoin nodes with JSON-RPC server enabled"
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
