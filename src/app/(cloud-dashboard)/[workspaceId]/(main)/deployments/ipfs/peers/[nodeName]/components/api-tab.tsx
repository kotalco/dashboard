"use client";

import { useParams } from "next/navigation";

import { IPFSPeer } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAPI } from "@/actions/edit-peer";

import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface APITabProps {
  node: IPFSPeer;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { api, gateway, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const onSubmit = (formData: FormData) => {
    const api = formData.get("api") === "on";
    const gateway = formData.get("gateway") === "on";
    execute({ api, gateway }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-6 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="api"
          label="API"
          className="justify-between"
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          defaultChecked={api}
        />
      </div>

      <div className="px-6 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="gateway"
          label="Gateway"
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          defaultChecked={gateway}
          className="justify-between"
        />
      </div>

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
