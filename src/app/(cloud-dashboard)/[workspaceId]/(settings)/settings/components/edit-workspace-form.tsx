"use client";

import { Workspace } from "@/types";
import { useAction } from "@/hooks/use-action";
import { editWorkspace } from "@/actions/edit-workspace";

import { Input } from "@/components/form/input";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";

interface EditWorkspaceFormProps {
  workspace: Workspace;
}

export const EditWorkspaceForm: React.FC<EditWorkspaceFormProps> = ({
  workspace,
}) => {
  const { name, id } = workspace;
  const { execute, error, success, fieldErrors } = useAction(editWorkspace);

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;

    execute({ name }, { workspaceId: id });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <Input
        id="name"
        errors={fieldErrors}
        label="Workspace Name"
        defaultValue={name}
      />

      <SubmitSuccess success={success}>
        Your workspace name has been has been changed.
      </SubmitSuccess>
      <SubmitError error={error} />

      <SubmitButton>Update</SubmitButton>
    </form>
  );
};
