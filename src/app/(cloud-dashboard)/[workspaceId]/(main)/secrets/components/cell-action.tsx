import { useState } from "react";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteSecret } from "@/actions/delete-secret";
import { useAction } from "@/hooks/use-action";
import { Roles } from "@/enums";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

import { SecretColumn } from "./colums";

interface CellRoleProps {
  data: SecretColumn;
}

export const CellAction: React.FC<CellRoleProps> = ({ data }) => {
  const { workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { execute, error } = useAction(deleteSecret, {
    onSuccess: () => setIsOpen(false),
  });
  const { name } = data;

  if (data.role !== Roles.Admin) return null;

  const onSubmit = () => {
    execute({ workspaceId: workspaceId as string, name });
  };

  return (
    <>
      <div className="flex justify-end transition opacity-0 group-hover:opacity-100">
        <Button
          onClick={() => setIsOpen(true)}
          type="button"
          variant="ghost"
          size="icon"
          className="border-destructive h-7 w-7"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
      <AlertModal title="Remove Secret" open={isOpen} onOpenChange={setIsOpen}>
        <p className="text-foreground/50 text-sm">
          Are you sure you want to remove secret <strong>({name})</strong>?
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
