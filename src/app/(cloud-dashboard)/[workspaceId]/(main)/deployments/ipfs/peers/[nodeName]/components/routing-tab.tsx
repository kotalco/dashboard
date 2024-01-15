"use client";

import { useParams } from "next/navigation";

import { IPFSPeer } from "@/types";
import { IPFSRouting, Roles } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { editRouting } from "@/actions/edit-peer";

import { Select } from "@/components/form/select";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface RoutingTabProps {
  node: IPFSPeer;
  role: Roles;
}

export const RoutingTab: React.FC<RoutingTabProps> = ({ node, role }) => {
  const { routing, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editRouting);

  const onSubmit = (formData: FormData) => {
    const routing = formData.get("routing") as IPFSRouting;
    execute({ routing }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Select
        id="routing"
        label="Content Routing Mechanism"
        disabled={role === Roles.Reader}
        defaultValue={routing}
        options={getSelectItems(IPFSRouting)}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        Routing settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
