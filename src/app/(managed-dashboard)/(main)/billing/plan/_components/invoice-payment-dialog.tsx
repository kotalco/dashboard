"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { prepareInvoicePayment } from "@/lib/actions";
import { StorageItems } from "@/enums";
import { dispatchLocalStorageUpdate } from "@/lib/utils";

interface ChangePlanDialogProps {
  children: React.ReactNode;
  intentId: string;
}

export const InvoicePaymentDialog: React.FC<ChangePlanDialogProps> = ({
  intentId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      localStorage.removeItem(StorageItems.INVOICE_DATA);
    }

    setOpen(open);
  };

  const handlePrepareInvoice = async () => {
    startTransition(async () => {
      localStorage.removeItem(StorageItems.INVOICE_DATA);
      dispatchLocalStorageUpdate(StorageItems.INVOICE_DATA, null);
      const state = await prepareInvoicePayment(intentId);
      localStorage.setItem(StorageItems.INVOICE_DATA, JSON.stringify(state));
      dispatchLocalStorageUpdate(
        StorageItems.INVOICE_DATA,
        JSON.stringify(state)
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="bg-[#F2C94C] px-2 bg-opacity-20 rounded-md inline-block">
        <span className="font-medium text-error">
          Your payment has been failed -{" "}
        </span>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="p-0"
            onClick={handlePrepareInvoice}
            disabled={isPending}
          >
            continue your payment
          </Button>
        </DialogTrigger>
        {children}
      </div>
    </Dialog>
  );
};
