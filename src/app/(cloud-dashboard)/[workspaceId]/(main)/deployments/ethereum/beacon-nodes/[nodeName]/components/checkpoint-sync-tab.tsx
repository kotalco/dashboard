"use client";

import { useParams } from "next/navigation";

import { BeaconNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editCheckpointSync } from "@/actions/edit-beacon-node";

import { Input } from "@/components/form/input";
import { ExternalLink } from "@/components/ui/external-link";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface CheckpointSyncTabProps {
  node: BeaconNode;
  role: Roles;
}

export const CheckpointSyncTab: React.FC<CheckpointSyncTabProps> = ({
  node,
  role,
}) => {
  const { checkpointSyncUrl, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } =
    useAction(editCheckpointSync);

  const onSubmit = (formData: FormData) => {
    const checkpointSyncUrl = formData.get("checkpointSyncUrl") as string;
    execute(
      { checkpointSyncUrl },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <Input
        className="max-w-xs"
        id="checkpointSyncUrl"
        label="Checkpoint Sync URL"
        defaultValue={checkpointSyncUrl}
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        description={
          <p className="text-sm text-foreground/70">
            Checkpoint sync endpoints available{" "}
            <ExternalLink href="https://eth-clients.github.io/checkpoint-sync-endpoints">
              here
            </ExternalLink>
          </p>
        }
      />

      <SubmitSuccess success={success}>
        Checkpoint Sync URL has been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
