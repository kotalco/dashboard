"use client";

import { useParams } from "next/navigation";

import { Input } from "@/components/form/input";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { ChainlinkNode } from "@/types";
import { Roles } from "@/enums";
import { editDatabase } from "@/actions/edit-chainlink";
import { useAction } from "@/hooks/use-action";

interface DatabaseTabProps {
  node: ChainlinkNode;
  role: Roles;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ node, role }) => {
  const { databaseURL, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editDatabase);

  const onSubmit = async (formData: FormData) => {
    const databaseURL = formData.get("databaseURL") as string;
    execute(
      { databaseURL },
      { name: name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Input
        id="databaseURL"
        label="Database Connection URL"
        defaultValue={databaseURL}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        className="max-w-sm"
      />

      <SubmitSuccess success={success}>
        Database settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <SubmitButton type="submit">Update</SubmitButton>
      )}
    </form>
  );
};
