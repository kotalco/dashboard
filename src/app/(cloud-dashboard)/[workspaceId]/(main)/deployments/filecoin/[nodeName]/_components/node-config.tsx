"use client";

import { useParams } from "next/navigation";

import { editFilecoinNode } from "@/actions/edit-filecoin";
import { useAction } from "@/hooks/use-action";
import { Roles } from "@/enums";
import { FilecoinNode, IPFSPeer, Version } from "@/types";
import {
  getCheckboxValue,
  getResourcesValues,
  readSelectWithInputValue,
} from "@/lib/utils";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { Resources } from "@/components/shared/deployments/resources";

import { Protocol } from "./protocol";
import { Api } from "./api";
import { Ipfs } from "./ipfs";
import { Logging } from "./logging";

interface NodeConfigProps {
  node: FilecoinNode;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  peers: IPFSPeer[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  peers,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editFilecoinNode);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const api = getCheckboxValue(formData, "api");
    const apiRequestTimeout = formData.get("apiRequestTimeout") as string;
    const ipfsForRetrieval = getCheckboxValue(formData, "ipfsForRetrieval");
    const ipfsOnlineMode = getCheckboxValue(formData, "ipfsOnlineMode");
    const ipfsPeerEndpoint = readSelectWithInputValue(
      "ipfsPeerEndpoint",
      formData
    );
    const disableMetadataLog = getCheckboxValue(formData, "disableMetadataLog");
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      api,
      apiRequestTimeout: api ? +apiRequestTimeout : null,
      ipfsForRetrieval,
      ipfsOnlineMode,
      ipfsPeerEndpoint,
      disableMetadataLog,
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

      {/* API */}
      <Api role={role} errors={fieldErrors} node={node} />

      {/* IPFS */}
      <Ipfs role={role} errors={fieldErrors} node={node} peers={peers} />

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
