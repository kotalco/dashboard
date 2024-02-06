import { Roles } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";
import { Secret } from "@/types";

import { DeleteSecretButton } from "./delete-secret-button";

interface DeleteSecretsButtonProps {
  secrets: Secret[];
  workspaceId: string;
}

export const DeleteSecretsButtons = async ({
  secrets,
  workspaceId,
}: DeleteSecretsButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) return null;

  return (
    <div className="col-span-12 absolute w-full rounded-md inset-y-0 group flex flex-col items-end justify-around">
      {secrets.map(({ name }) => (
        <DeleteSecretButton key={name} name={name} />
      ))}
    </div>
  );
};
