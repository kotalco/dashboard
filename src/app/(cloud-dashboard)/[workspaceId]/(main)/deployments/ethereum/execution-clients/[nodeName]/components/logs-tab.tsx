"use client";

import { useParams } from "next/navigation";

import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode } from "@/types";
import { ExecutionClientLogging, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editLogs } from "@/actions/edit-execution-client";

import { Select } from "@/components/form/select";
import { Logs } from "@/components/logs";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface LogsTabProps {
  node: ExecutionClientNode;
  role: Roles;
  token: string;
}

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const { workspaceId } = useParams();
  const { logging, name } = node;
  const { execute, fieldErrors, success, error } = useAction(editLogs);

  const onSubmit = (formData: FormData) => {
    const logging = formData.get("logging") as ExecutionClientLogging;
    execute({ logging }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="logging"
        label="Verbosity Levels"
        options={getSelectItems(ExecutionClientLogging)}
        defaultValue={logging}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
      />

      <Logs
        url={`ethereum/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${workspaceId}`}
      />

      <SubmitSuccess success={success}>
        Logging settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
