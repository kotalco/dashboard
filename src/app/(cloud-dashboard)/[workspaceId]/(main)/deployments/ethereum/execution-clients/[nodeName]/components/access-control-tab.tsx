"use client";

import { useParams } from "next/navigation";

import { ExecutionClientNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAccessControl } from "@/actions/edit-execution-client";

import { Textarea } from "@/components/form/textarea";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface AccessControlTabProps {
  node: ExecutionClientNode;
  role: Roles;
}

export const AccessControlTab: React.FC<AccessControlTabProps> = ({
  node,
  role,
}) => {
  const { workspaceId } = useParams();
  const { hosts, corsDomains, name } = node;
  const { execute, fieldErrors, error, success } = useAction(editAccessControl);

  const onSubmit = (formData: FormData) => {
    const hosts = formData.get("hosts") as string;
    const corsDomains = formData.get("corsDomains") as string;
    execute(
      { hosts, corsDomains },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Textarea
        id="hosts"
        label="Whitelisted Hosts"
        defaultValue={hosts}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        description="* (asterisk) means trust all hosts"
        tooltip="Server Enforced"
        className="max-w-xs"
      />

      <Textarea
        id="corsDomains"
        label="CORS Domains"
        defaultValue={corsDomains}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        description="* (asterisk) means trust all domains"
        tooltip="Browser Enforced"
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Access control settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
