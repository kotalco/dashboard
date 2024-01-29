"use client";

import { useParams } from "next/navigation";

import { editPolkadotNode } from "@/actions/edit-polkadot";
import { PolkadotLogging, PolkadotSyncModes, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { getCheckboxValue, getResourcesValues } from "@/lib/utils";
import { OptionType, PolkadotNode, Version } from "@/types";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Resources } from "@/components/shared/deployments/resources";

import { Protocol } from "./protocol";
import { Networking } from "./networking";
import { ValidatorApi } from "./validator-api";
import { Telemetry } from "./telemetry";
import { Prometheus } from "./prometheus";
import { AccessControl } from "./access-control-tab";
import { Logging } from "./logging";

interface NodeConfigProps {
  node: PolkadotNode;
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

  const { execute, fieldErrors, error, success } = useAction(editPolkadotNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const nodePrivateKeySecretName = formData.get(
      "nodePrivateKeySecretName"
    ) as string;
    const p2pPort = Number(formData.get("p2pPort"));
    const syncMode = formData.get("syncMode") as PolkadotSyncModes;
    const retainedBlocks = Number(formData.get("retainedBlocks"));
    const validator = getCheckboxValue(formData, "validator");
    const rpc = getCheckboxValue(formData, "rpc");
    const rpcPort = Number(formData.get("rpcPort"));
    const ws = getCheckboxValue(formData, "ws");
    const wsPort = Number(formData.get("wsPort"));
    const telemetry = getCheckboxValue(formData, "telemetry");
    const telemetryURL = formData.get("telemetryURL") as string;
    const prometheus = getCheckboxValue(formData, "prometheus");
    const prometheusPort = Number(formData.get("prometheusPort"));
    const corsDomains = formData.get("corsDomains") as string;
    const logging = formData.get("logging") as PolkadotLogging;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      nodePrivateKeySecretName,
      p2pPort,
      syncMode,
      retainedBlocks,
      validator,
      rpc,
      rpcPort,
      ws,
      wsPort,
      telemetry,
      telemetryURL,
      prometheus,
      prometheusPort,
      corsDomains,
      logging,
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
      <Networking
        role={role}
        errors={fieldErrors}
        node={node}
        privateKeys={privateKeys}
      />

      {/* Validator & API */}
      <ValidatorApi role={role} errors={fieldErrors} node={node} />

      {/* Telemetry */}
      <Telemetry role={role} errors={fieldErrors} node={node} />

      {/* Prometheus */}
      <Prometheus role={role} errors={fieldErrors} node={node} />

      {/* Access Control */}
      <AccessControl role={role} errors={fieldErrors} node={node} />

      {/* Logs */}
      <Logging role={role} errors={fieldErrors} node={node} />

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
