"use client";

import { useParams } from "next/navigation";

import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { BeaconNode, ExecutionClientNode, OptionType, Version } from "@/types";
import {
  getCheckboxValue,
  getResourcesValues,
  readSelectWithInputValue,
} from "@/lib/utils";
import { editBeaconNode } from "@/actions/edit-beacon-node";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Resources } from "@/components/shared/deployments/resources";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { TableOfContent } from "@/components/table-of-content";

import { Protocol } from "./protocol";
import { Api } from "./api";
import { ExecutionClient } from "./execution-client";
import { CheckpointSync } from "./checkpoint-sync";

interface NodeConfigProps {
  node: BeaconNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  jwts: OptionType[];
  executionClients: ExecutionClientNode[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  jwts,
  executionClients,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editBeaconNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const executionEngineEndpoint = readSelectWithInputValue(
      "executionEngineEndpoint",
      formData
    );
    const jwtSecretName = formData.get("jwtSecretName") as string;
    const checkpointSyncUrl = formData.get("checkpointSyncUrl") as string;
    const rpc = getCheckboxValue(formData, "rpc");
    const rest = getCheckboxValue(formData, "rest");
    const grpc = getCheckboxValue(formData, "grpc");
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      executionEngineEndpoint,
      jwtSecretName,
      checkpointSyncUrl,
      rpc,
      rest,
      grpc,
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

        {/* Execution Client */}
        <ExecutionClient
          node={node}
          role={role}
          errors={fieldErrors}
          jwts={jwts}
          executionClients={executionClients}
        />

        {/* Checkpoint Sync */}
        <CheckpointSync node={node} role={role} errors={fieldErrors} />

        {/* API */}
        <Api role={role} errors={fieldErrors} node={node} />

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
