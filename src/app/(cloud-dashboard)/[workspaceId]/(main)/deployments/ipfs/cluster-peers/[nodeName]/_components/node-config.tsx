"use client";

import { useParams } from "next/navigation";

import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { IPFSClusterPeer, IPFSPeer, Version } from "@/types";
import { getResourcesValues, readSelectWithInputValue } from "@/lib/utils";
import { editIpfsClusterPeer } from "@/actions/edit-cluster-peer";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Resources } from "@/components/shared/deployments/resources";
import { ImageVersion } from "@/components/shared/deployments/image-version";
import { TableOfContent } from "@/components/table-of-content";

import { Protocol } from "./protocol";
import { Peers } from "./peers";
import { Security } from "./security";

interface NodeConfigProps {
  node: IPFSClusterPeer;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
  peers: IPFSPeer[];
  clusterPeers: IPFSClusterPeer[];
}

export const NodeConfig = ({
  node,
  role,
  versions,
  peers,
  clusterPeers,
}: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } =
    useAction(editIpfsClusterPeer);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const peerEndpoint = readSelectWithInputValue("peerEndpoint", formData);
    const bootstrapPeers = formData.getAll("bootstrapPeers") as string[];
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      peerEndpoint,
      bootstrapPeers,
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

        {/* Peers */}
        <Peers
          role={role}
          errors={fieldErrors}
          node={node}
          peers={peers}
          clusterPeers={clusterPeers}
        />

        {/* Security */}
        <Security node={node} />

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
