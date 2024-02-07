"use client";

import { useParams } from "next/navigation";

import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { BeaconNode, OptionType, ValidatorNode, Version } from "@/types";
import { getResourcesValues } from "@/lib/utils";
import { editValidatorNode } from "@/actions/edit-validator";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Resources } from "@/components/shared/deployments/resources";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { TableOfContent } from "@/components/table-of-content";

import { Protocol } from "./protocol";
import { Graffiti } from "./graffiti";
import { Keystore } from "./keystore";
import { BeaconNodeConfig } from "./beacon-node";

interface NodeConfigProps {
  node: ValidatorNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  passwords: OptionType[];
  keystores: OptionType[];
  beaconNodes: BeaconNode[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  passwords,
  keystores,
  beaconNodes,
}: NodeConfigProps) => {
  const { name, image, client } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editValidatorNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const graffiti = formData.get("graffiti") as string;
    const keystores = formData.getAll("keystores") as [string, ...string[]];
    const walletPasswordSecretName = formData.get(
      "walletPasswordSecretName"
    ) as string;
    const beaconEndpoints = formData.getAll("beaconEndpoints") as [
      string,
      ...string[]
    ];
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      client,
      graffiti,
      keystores,
      walletPasswordSecretName,
      beaconEndpoints,
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

        {/* Graffiti */}
        <Graffiti node={node} role={role} errors={fieldErrors} />

        {/* Keystores */}
        <Keystore
          node={node}
          role={role}
          errors={fieldErrors}
          ethereumKeystores={keystores}
          passwords={passwords}
        />

        {/* Beacon Node */}
        <BeaconNodeConfig
          node={node}
          role={role}
          beaconNodes={beaconNodes}
          errors={fieldErrors}
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
