"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormState, useFormStatus } from "react-dom";
import { deletePaymentCard } from "@/lib/actions";
import { Alert } from "@/components/ui/alert";

interface DeleteCardProps {
  id: string;
}

export const DeleteCard: React.FC<DeleteCardProps> = ({ id }) => {
  const initialState = { message: null };
  const [state, dispatch] = useFormState(
    deletePaymentCard.bind(null, id),
    initialState
  );
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) setOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8"
              onClick={() => setOpen(true)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payment Card</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this payment card? This action
            cannot
          </p>
          {state.message && (
            <Alert variant="destructive">{state.message}</Alert>
          )}
          <form action={dispatch}>
            <ActionButtons onClose={() => handleOpenChange(false)} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionButtons: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={onClose}
      >
        Cancel
      </Button>

      <Button type="submit" disabled={pending} variant="destructive">
        Confirm
      </Button>
    </div>
  );
};
