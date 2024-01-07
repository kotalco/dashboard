"use client";

import { useParams } from "next/navigation";

import { StacksNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAPI } from "@/actions/edit-stacks";

import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface APITabProps {
  node: StacksNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { rpc, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const onSubmit = async (formData: FormData) => {
    const rpc = formData.get("rpc") === "on";

    await execute({ rpc }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          defaultChecked={rpc}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />
      </div>

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
