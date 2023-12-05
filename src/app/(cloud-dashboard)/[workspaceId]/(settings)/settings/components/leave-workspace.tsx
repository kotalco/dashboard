"use client";

import { useAction } from "@/hooks/use-action";
import { leaveWorkspace } from "@/actions/laeve-workspace";

import { AlertModal } from "@/components/modals/alert-modal";
import { SubmitError } from "@/components/form/submit-error";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";

interface LeaveWorkspaceProps {
  id: string;
}

export const LeaveWorkspace: React.FC<LeaveWorkspaceProps> = ({ id }) => {
  const { execute, error } = useAction(leaveWorkspace);

  const onSubmit = () => {
    execute({ id });
  };

  return (
    <div className="flex justify-between gap-x-4">
      <p>
        Leave the current workspace, this action is critical and cann&apos;t be
        undone untill you have been invited again.
      </p>
      <AlertModal
        triggerText="Leave Workspace"
        buttonVariant="outline"
        title="Leave Workspace"
      >
        <form action={onSubmit} className="space-y-4">
          <p className="text-foreground/70 text-sm">
            Are you sure you want to leave this workspace? You might not be able
            to join this workspace again if not invited
          </p>

          <SubmitError error={error} />

          <CloseDialogButton>
            <SubmitButton variant="destructive">Leave</SubmitButton>
          </CloseDialogButton>
        </form>
      </AlertModal>
    </div>
  );
};
