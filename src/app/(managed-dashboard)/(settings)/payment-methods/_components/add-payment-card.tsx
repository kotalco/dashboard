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
import { Plus } from "lucide-react";

type InitialState = {
  message: null | string;
  si_secret: null | string;
};

export const AddPaymentCard = () => {
  const initialState: InitialState = { message: null, si_secret: null };

  const [state, dispatch] = useFormState(createSetupIntent, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form action={dispatch}>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Card
          </Button>
        </form>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
        </DialogHeader>
        <AddNewCardForm state={state} />
      </DialogContent>
    </Dialog>
  );
};
