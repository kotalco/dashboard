"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { StorageItems } from "@/enums";
import { useChangeSubscriptionModal } from "@/hooks/use-change-subscription-modal";
import { delay } from "@/lib/utils";

interface ChangePlanDialogProps {
  children: React.ReactNode;
}

export const ChangePlanDialog: React.FC<ChangePlanDialogProps> = ({
  children,
}) => {
  const { onClose, setStep, isOpen, onOpen } = useChangeSubscriptionModal();

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      onClose();
      await delay(100);
      setStep(1);
    }

    if (open) {
      onOpen();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button">Change Plan</Button>
        </DialogTrigger>
        {children}
      </Dialog>
    </>
  );
};
