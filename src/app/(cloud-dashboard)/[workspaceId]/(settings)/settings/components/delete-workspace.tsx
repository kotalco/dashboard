"use client";

import { Workspace } from "@/types";
import { useAction } from "@/hooks/use-action";
import { deleteWorkspace } from "@/actions/delete-workspace";

import { AlertModal } from "@/components/modals/alert-modal";
import { SubmitError } from "@/components/form/submit-error";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";

interface DeleteWorkspaceProps {
  workspace: Workspace;
}

export const DeleteWorkspace: React.FC<DeleteWorkspaceProps> = ({
  workspace,
}) => {
  const { id } = workspace;
  const { execute, error } = useAction(deleteWorkspace);

  const onSubmit = () => {
    execute({ id });
  };

  return (
    <div className="flex justify-between gap-x-4">
      <p>
        Delete the current workspace. Please take care this is going to delete
        all deployments running in the current workspace
      </p>
      <AlertModal triggerText="Delete Workspace" title="Delete Workspace">
        <form action={onSubmit} className="space-y-4">
          <p className="text-foreground/70 text-sm">
            Are you sure you want to delete your workspace? all of your
            deployments will be permenantly removed from our servers forever.
            This action can&apos;t be undone
          </p>

          <SubmitError error={error} />

          <CloseDialogButton>
            <SubmitButton variant="destructive">Delete</SubmitButton>
          </CloseDialogButton>
        </form>
      </AlertModal>
    </div>
  );
};
