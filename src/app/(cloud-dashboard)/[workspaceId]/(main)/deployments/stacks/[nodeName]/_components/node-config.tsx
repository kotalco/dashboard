"use client";

import { useParams } from "next/navigation";

import { editStacksNode } from "@/actions/edit-stacks";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { getCheckboxValue, getResourcesValues } from "@/lib/utils";
import { BitcoinNode, OptionType, StacksNode, Version } from "@/types";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Resources } from "@/components/shared/deployments/resources";
import { TableOfContent } from "@/components/table-of-content";

import { Protocol } from "./protocol";
import { Networking } from "./networking";
import { Api } from "./api";
import { Bitcoin } from "./bitcoin";
import { Mining } from "./mining";

interface NodeConfigProps {
  node: StacksNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  bitcoinNodes: BitcoinNode[];
  privateKeys: OptionType[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  bitcoinNodes,
  privateKeys,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editStacksNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const nodePrivateKeySecretName = formData.get(
      "nodePrivateKeySecretName"
    ) as string;
    const rpc = getCheckboxValue(formData, "rpc");
    const bitcoinNode = formData.get("bitcoinNode") as string;
    const mineMicroBlocks = getCheckboxValue(formData, "mineMicroBlocks");
    const miner = getCheckboxValue(formData, "miner");
    const seedPrivateKeySecretName = formData.get(
      "seedPrivateKeySecretName"
    ) as string;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      nodePrivateKeySecretName,
      bitcoinNode,
      mineMicroBlocks,
      miner,
      seedPrivateKeySecretName,
      rpc,
      cpu,
      cpuLimit,
      memory,
      memoryLimit,
      storage,
      workspaceId,
    });
  };

  return (
    <TableOfContent>
      <form action={onSubmit} className="space-y-16">
        <div className="space-y-4">
          {/* Protocol */}
          <Protocol node={node} />

          {/* Image Version */}
          <ImageVersion
            role={role}
            versions={versions}
            image={image}
            errors={fieldErrors}
          />
        </div>

        {/* Networking */}
        <Networking
          role={role}
          errors={fieldErrors}
          node={node}
          privateKeys={privateKeys}
        />

        {/* API */}
        <Api role={role} errors={fieldErrors} node={node} />

        {/* Bitcoin */}
        <Bitcoin
          node={node}
          role={role}
          errors={fieldErrors}
          bitcoinNodes={bitcoinNodes}
        />

        {/* Mining */}
        <Mining
          role={role}
          errors={fieldErrors}
          node={node}
          privateKeys={privateKeys}
        />

        {/* Resources */}
        <Resources role={role} errors={fieldErrors} node={node} />

        <div className="space-y-4">
          <SubmitSuccess success={success}>
            Your node configrations have been updated successfully.
          </SubmitSuccess>

          <SubmitError error={error} />

          {role !== Roles.Reader && (
            <SubmitButton data-testid="submit" type="submit">
              Update
            </SubmitButton>
          )}
        </div>
      </form>
    </TableOfContent>
  );
};
