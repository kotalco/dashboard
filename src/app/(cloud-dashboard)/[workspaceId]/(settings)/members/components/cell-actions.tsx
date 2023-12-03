import { useState } from "react";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import { useWorkspace } from "@/hooks/useWorkspace";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { removeUser } from "@/actions/remove-member";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { SubmitError } from "@/components/form/submit-error";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";

import { TeamMemberColumn } from "./columns";

interface CellRoleProps {
  data: TeamMemberColumn;
}

export const CellActions: React.FC<CellRoleProps> = ({ data }) => {
  const { workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { workspace, isLoading: isInitialLoading } = useWorkspace(
    workspaceId as string
  );
  const { execute, error } = useAction(removeUser, {
    onSuccess: () => setIsOpen(false),
  });
  const { isCurrentUser, id, email } = data;

  if (isInitialLoading) return <Skeleton className="w-4 h-4 " />;

  if (isCurrentUser || workspace?.role !== Roles.Admin) return null;

  const onSubmit = () => {
    execute({ workspaceId: workspaceId as string, id });
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => setIsOpen(true)}
          type="button"
          variant="destructive"
          size="icon"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <AlertModal
        title="Remove Team Member"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <p className="text-foreground/50 text-sm">
          Are you sure you want to remove member <strong>({email})</strong>?
          This user will not be able to access any deployment untill invited
          again!
        </p>

        <SubmitError error={error} />

        <form action={onSubmit}>
          <CloseDialogButton>
            <SubmitButton variant="destructive">Continue</SubmitButton>
          </CloseDialogButton>
        </form>
      </AlertModal>
    </>
  );
};
