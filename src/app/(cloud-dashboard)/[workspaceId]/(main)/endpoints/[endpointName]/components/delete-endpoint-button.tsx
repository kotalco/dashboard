import { DeleteEndpoint } from "@/components/shared/endpoint/delete-endpoint";
import { Roles } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";

interface DeleteEndpointButtonProps {
  workspaceId: string;
  name: string;
}

export const DeleteEndpointButton = async ({
  workspaceId,
  name,
}: DeleteEndpointButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role !== Roles.Admin) {
    return null;
  }

  return (
    <DeleteEndpoint
      name={name}
      url={`/endpoints/${name}?workspace_id=${workspaceId}`}
      redirectUrl={`/${workspaceId}/endpoints`}
    />
  );
};
