"use client";

import { useParams } from "next/navigation";

import { FilecoinNode } from "@/types";
import { Roles } from "@/enums";
import { editLogging } from "@/actions/edit-filecoin";

import { Logs } from "@/components/logs";
import { useAction } from "@/hooks/use-action";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface LogsTabProps {
  node: FilecoinNode;
  role: Roles;
  token: string;
}

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const { workspaceId } = useParams();
  const { disableMetadataLog, name } = node;
  const { execute, fieldErrors, error, success } = useAction(editLogging);

  const onSubmit = (formData: FormData) => {
    const disableMetadataLog = formData.get("disableMetadataLog") === "on";
    execute(
      {
        disableMetadataLog,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="disableMetadataLog"
        label="Disable Metadata Logs"
        disabled={role === Roles.Reader}
        defaultChecked={disableMetadataLog}
        errors={fieldErrors}
      />

      <Logs
        url={`filecoin/nodes/${name}/logs?authorization=Bearer ${token}&workspace_id=${workspaceId}`}
      />

      <SubmitSuccess success={success}>
        Logging settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
