"use client";

import { useParams } from "next/navigation";

import { IPFSRouting, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { IPFSPeer, Version } from "@/types";
import { getCheckboxValue, getResourcesValues } from "@/lib/utils";
import { editIpfsPeer } from "@/actions/edit-peer";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Resources } from "@/components/shared/deployments/resources";
import { ImageVersion } from "@/components/shared/deployments/image-version";

import { Protocol } from "./protocol";
import { Api } from "./api";
import { Routing } from "./routing";
import { TableOfContent } from "@/components/table-of-content";

interface NodeConfigProps {
  node: IPFSPeer;
  role: Roles;
  versions: (Version & {
    disabled?: boolean | undefined;
  })[];
}

export const NodeConfig = ({ node, role, versions }: NodeConfigProps) => {
  const { name, image } = node;
  const { workspaceId } = useParams() as { workspaceId: string };

  const { execute, fieldErrors, error, success } = useAction(editIpfsPeer);

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string | null;
    const api = getCheckboxValue(formData, "api");
    const gateway = getCheckboxValue(formData, "gateway");
    const routing = formData.get("routing") as IPFSRouting;
    const { cpu, cpuLimit, memory, memoryLimit, storage } =
      getResourcesValues(formData);

    execute({
      name,
      image,
      api,
      gateway,
      routing,
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

        {/* API */}
        <Api role={role} errors={fieldErrors} node={node} />

        {/* Routing */}
        <Routing role={role} errors={fieldErrors} node={node} />

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
