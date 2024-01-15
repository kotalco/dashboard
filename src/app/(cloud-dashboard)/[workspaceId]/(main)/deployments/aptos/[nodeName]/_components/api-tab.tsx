"use client";

import { useParams } from "next/navigation";

import { Toggle } from "@/components/form/toggle";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

import { AptosNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAptosNode } from "@/actions/edit-aptos";

interface APITabProps {
  node: AptosNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editAptosNode);
  const { api, name } = node;

  const onSubmit = (formData: FormData) => {
    const api = formData.get("api") === "on";
    execute({ api }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-6 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="api"
          label="REST"
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          defaultChecked={api}
          className="justify-between"
        />
      </div>

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <SubmitButton data-testid="submit" type="submit">
          Update
        </SubmitButton>
      )}
    </form>
  );
};
