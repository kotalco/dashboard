"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSetupIntent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { AddNewCardForm } from "./add-new-card-form";

export const AddPaymentCard = () => {
  const initialState = { message: null, si_secret: null };

  const [state, dispatch] = useFormState(createSetupIntent, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={dispatch}>
          <Button>Add a new payment card</Button>
        </form>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <AddNewCardForm state={state} />
      </DialogContent>
    </Dialog>
  );
};
