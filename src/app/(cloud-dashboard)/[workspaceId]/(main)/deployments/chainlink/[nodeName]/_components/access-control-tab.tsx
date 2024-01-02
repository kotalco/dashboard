"use client";

import { useParams } from "next/navigation";

import { Textarea } from "@/components/form/textarea";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { ChainlinkNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAccessControl } from "@/actions/edit-chainlink";

interface AccessControlTabProps {
  node: ChainlinkNode;
  role: Roles;
}

export const AccessControlTab: React.FC<AccessControlTabProps> = ({
  node,
  role,
}) => {
  const { corsDomains, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editAccessControl);

  const onSubmit = (formData: FormData) => {
    const corsDomains = formData.get("corsDomains") as string;
    execute({ corsDomains }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Textarea
        id="corsDomains"
        label="CORS Domains"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultValue={corsDomains}
        description="One domain per line"
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
