"use client";

import { useParams } from "next/navigation";

import { Select } from "@/components/form/select";
import { Logs } from "@/components/logs";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { getSelectItems } from "@/lib/utils";
import { ChainlinkNode } from "@/types";
import { ChainlinkLogging, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editLogs } from "@/actions/edit-chainlink";

interface LogsTabProps {
  node: ChainlinkNode;
  role: Roles;
  token: string;
}

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const { workspaceId } = useParams();
  const { logging, name } = node;
  const { execute, fieldErrors, error, success } = useAction(editLogs);

  const onSubmit = (formData: FormData) => {
    const logging = formData.get("logging") as ChainlinkLogging;
    execute({ logging }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Select
        id="logging"
        label="Verbosity Levels"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={logging}
        options={getSelectItems(ChainlinkLogging)}
      />

      <Logs
        url={`chainlink/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${workspaceId}`}
      />

      <SubmitSuccess success={success}>
        Logging settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
