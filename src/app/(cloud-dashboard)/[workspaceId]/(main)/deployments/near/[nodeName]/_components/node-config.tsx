"use client";

import { useParams } from "next/navigation";

import { Roles } from "@/enums";
import { NEARNode, OptionType, Version } from "@/types";
import { useAction } from "@/hooks/use-action";
import { getCheckboxValue, getResourcesValues } from "@/lib/utils";
import { editNearNode } from "@/actions/edit-near";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Resources } from "@/components/shared/deployments/resources";

import { Protocol } from "./protocol";
import { Networking } from "./networking";
import { Rpc } from "./rpc";
import { Validator } from "./validator";
import { Prometheus } from "./prometheus";
import { Telemetry } from "./telemetry";

interface NodeConfigProps {
  node: NEARNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  privateKeys: OptionType[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  privateKeys,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editNearNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const nodePrivateKeySecretName = formData.get(
      "nodePrivateKeySecretName"
    ) as string;
    const minPeers = Number(formData.get("minPeers"));
    const p2pPort = Number(formData.get("p2pPort"));
    const bootnodes = formData.get("bootnodes") as string;
    const rpc = getCheckboxValue(formData, "rpc");
    const rpcPort = Number(formData.get("rpcPort"));
    const validatorSecretName = formData.get("validatorSecretName") as string;
    const prometheusPort = Number(formData.get("prometheusPort"));
    const telemetryURL = formData.get("telemetryURL") as string;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      nodePrivateKeySecretName,
      minPeers,
      p2pPort,
      bootnodes,
      rpc,
      rpcPort: rpc ? rpcPort : null,
      validatorSecretName,
      prometheusPort,
      telemetryURL,
      cpu,
      cpuLimit,
      memory,
      memoryLimit,
      storage,
      workspaceId,
    });
  };

  return (
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
      <Networking node={node} role={role} privateKeys={privateKeys} />

      {/* RPC */}
      <Rpc node={node} role={role} errors={fieldErrors} />

      {/* Validator */}
      <Validator
        node={node}
        role={role}
        privateKeys={privateKeys}
        errors={fieldErrors}
      />

      {/* Prometheus */}
      <Prometheus node={node} role={role} errors={fieldErrors} />

      {/* Telemetry */}
      <Telemetry node={node} role={role} errors={fieldErrors} />

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
  );
};
