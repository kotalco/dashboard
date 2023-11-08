"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { StorageItems } from "@/enums";

interface ChangePlanDialogProps {
  children: React.ReactNode;
}

export const ChangePlanDialog: React.FC<ChangePlanDialogProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      localStorage.removeItem(StorageItems.CHANGE_PLAN_DATA);
    }

    setOpen(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button">Change Plan</Button>
        </DialogTrigger>
        {children}
      </Dialog>
    </>
  );
};
