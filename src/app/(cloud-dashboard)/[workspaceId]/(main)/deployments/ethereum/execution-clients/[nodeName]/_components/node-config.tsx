"use client";

import { useParams } from "next/navigation";

import {
  ExecutionClientAPI,
  ExecutionClientClients,
  ExecutionClientLogging,
  ExecutionClientSyncMode,
  Roles,
} from "@/enums";
import { ExecutionClientNode, OptionType, Version } from "@/types";
import { getCheckboxValue, getResourcesValues } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { editExecutionClientNode } from "@/actions/edit-execution-client";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Resources } from "@/components/shared/deployments/resources";

import { Protocol } from "./protocol";
import { Networking } from "./networking";
import { Api } from "./api";
import { AccessControl } from "./access-control-tab";
import { Logging } from "./logging";

interface NodeConfigProps {
  node: ExecutionClientNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  privateKeys: OptionType[];
  jwts: OptionType[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  privateKeys,
  jwts,
}: NodeConfigProps) => {
  const { name, image, client } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(
    editExecutionClientNode
  );

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const nodePrivateKeySecretName = formData.get(
      "nodePrivateKeySecretName"
    ) as string;
    const syncMode = formData.get("syncMode") as ExecutionClientSyncMode;
    const staticNodes = formData.get("staticNodes") as string;
    const bootnodes = formData.get("bootnodes") as string;
    const engine = getCheckboxValue(formData, "engine");
    const jwtSecretName = formData.get("jwtSecretName") as string;
    const rpc = getCheckboxValue(formData, "rpc");
    const rpcAPI = formData.getAll("rpcAPI") as ExecutionClientAPI[];
    const ws = getCheckboxValue(formData, "ws");
    const wsAPI = formData.getAll("wsAPI") as ExecutionClientAPI[];
    const graphql = getCheckboxValue(formData, "graphql");
    const hosts = formData.get("hosts") as string;
    const corsDomains = formData.get("corsDomains") as string;
    const logging = formData.get("logging") as ExecutionClientLogging;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      nodePrivateKeySecretName,
      syncMode,
      staticNodes,
      bootnodes,
      client,
      engine,
      jwtSecretName,
      rpc,
      rpcAPI,
      ws,
      wsAPI,
      graphql,
      hosts,
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

      {/* API */}
      <Api role={role} errors={fieldErrors} node={node} jwts={jwts} />

      {/* Access Control */}
      {node.client !== ExecutionClientClients.Nethermind && (
        <AccessControl node={node} role={role} errors={fieldErrors} />
      )}

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
