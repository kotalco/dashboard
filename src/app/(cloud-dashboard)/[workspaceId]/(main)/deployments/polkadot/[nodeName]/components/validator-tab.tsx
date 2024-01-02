"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import { editValidator } from "@/actions/edit-polkadot";

import { useAction } from "@/hooks/use-action";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { AlertModal } from "@/components/modals/alert-modal";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { Button } from "@/components/ui/button";

interface ValidatorTabProps {
  node: PolkadotNode;
  role: Roles;
}

export const ValidatorTab: React.FC<ValidatorTabProps> = ({ node, role }) => {
  const { validator, pruning, rpc, name } = node;
  const { workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isValidator, setIsValidator] = useState(validator);
  const { execute, fieldErrors, error, success } = useAction(editValidator);

  const onSubmit = () => {
    execute(
      { rpc, validator: isValidator },
      { name, workspaceId: workspaceId as string }
    );
  };

  const handleConfirm = () => {
    setIsValidator(true);
    setIsOpen(false);
  };

  const handleCheckChange = (value: boolean) => {
    if (value && rpc) {
      setIsOpen(value);
    }
    setIsValidator(value);
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="validator"
        label="Validator"
        disabled={role === Roles.Reader || pruning}
        checked={isValidator}
        defaultChecked={isValidator}
        onCheckedChange={handleCheckChange}
        errors={fieldErrors}
        description={pruning ? "Node started with pruning enabled." : ""}
      />

      <SubmitSuccess success={success}>
        Validator settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}

      <AlertModal open={isOpen} onOpenChange={setIsOpen} title="Warning">
        <p className="text-foreground/70 text-sm">
          Activating validator will disable JSON-RPC Port. Are you sure you want
          to continue?
        </p>

        <CloseDialogButton>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Continue
          </Button>
        </CloseDialogButton>
      </AlertModal>
    </form>
  );
};
