"use client";

import { useParams } from "next/navigation";

import { getSelectItems } from "@/lib/utils";
import { PolkadotNode } from "@/types";
import { ChainlinkLogging, PolkadotLogging, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editLogs } from "@/actions/edit-polkadot";

import { Select } from "@/components/form/select";
import { Logs } from "@/components/logs";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface LogsTabProps {
  node: PolkadotNode;
  role: Roles;
  token: string;
}

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const { logging, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editLogs);

  const onSubmit = (formData: FormData) => {
    const logging = formData.get("logging") as PolkadotLogging;
    execute({ logging }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="logging"
        label="Verbosity Levels"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={logging}
        options={getSelectItems(ChainlinkLogging)}
        className="max-w-xs"
      />

      <Logs
        url={`polkadot/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${workspaceId}`}
      />

      <SubmitSuccess success={success}>
        Logging settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
