"use client";

import { useParams } from "next/navigation";

import { ValidatorNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editGraffiti } from "@/actions/edit-validator";

import { Input } from "@/components/form/input";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface GraffitiTabProps {
  node: ValidatorNode;
  role: Roles;
}

export const GraffitiTab: React.FC<GraffitiTabProps> = ({ node, role }) => {
  const { graffiti, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editGraffiti);

  const onSubmit = (formData: FormData) => {
    const graffiti = formData.get("graffiti") as string;
    execute({ graffiti }, { name: name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Input
        id="graffiti"
        label="Graffiti"
        errors={fieldErrors}
        defaultValue={graffiti}
        disabled={role === Roles.Reader}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Graffiti settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
