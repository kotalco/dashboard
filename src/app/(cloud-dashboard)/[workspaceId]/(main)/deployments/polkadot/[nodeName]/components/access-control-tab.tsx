"use client";

import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAccessControl } from "@/actions/edit-polkadot";

import { Textarea } from "@/components/form/textarea";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface AccessControlTabProps {
  node: PolkadotNode;
  role: Roles;
}

export const AccessControlTab: React.FC<AccessControlTabProps> = ({
  node,
  role,
}) => {
  const { corsDomains, name } = node;
  const { workspaceId } = useParams();
  const { execute, success, fieldErrors, error } = useAction(editAccessControl);

  const onSubmit = (formData: FormData) => {
    const corsDomains = formData.get("corsDomains") as string;

    execute({ corsDomains }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Textarea
        id="corsDomains"
        label="CORS Domains"
        disabled={role === Roles.Reader}
        className="max-w-xs"
        description="One domain per line"
        errors={fieldErrors}
        defaultValue={corsDomains.join("\n")}
      />

      <SubmitSuccess success={success}>
        Access control settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
