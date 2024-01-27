"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteSecret } from "@/actions/delete-secret";
import { useAction } from "@/hooks/use-action";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface DeleteSecretButtonProps {
  name: string;
}

export const DeleteSecretButton = ({ name }: DeleteSecretButtonProps) => {
  const { workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { execute, error } = useAction(deleteSecret, {
    onSuccess: () => setIsOpen(false),
  });

  const onSubmit = () => {
    execute({ workspaceId: workspaceId as string, name });
  };

  return (
    <>
      <div className="mb-7">
        <Button
          onClick={() => setIsOpen(true)}
          type="button"
          variant="destructive"
          size="icon"
        >
          <Trash2 strokeWidth={1} className="w-5 h-5" />
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
