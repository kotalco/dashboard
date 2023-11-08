"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { prepareInvoicePayment } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { InvoicePaymentForm } from "./invoice-payment-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PaymentIntentState = {
  pi_secret: null | string;
  message: null | string;
};

export const InvoicePayment: React.FC<{ intentId: string }> = ({
  intentId,
}) => {
  const initialState = { pi_secret: null, message: null };
  const [state, dispatch] = useFormState<PaymentIntentState>(
    prepareInvoicePayment.bind(null, intentId),
    initialState
  );

  return (
    <Dialog>
      <div className="bg-[#F2C94C] px-2 bg-opacity-20 rounded-md inline-block">
        <DialogTrigger asChild>
          <form action={dispatch}>
            <ContinuePaymentButton />
          </form>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Payment</DialogTitle>
          </DialogHeader>
          <InvoicePaymentForm state={state} />
        </DialogContent>
      </div>
    </Dialog>
  );
};

const ContinuePaymentButton = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return <Loader2 className="w-3 h-3 animate-spin" />;
  }

  return (
    <>
      <span className="font-medium text-error">
        Your payment has been failed -{" "}
      </span>
      <Button variant="link" className="p-0">
        continue your payment
      </Button>
    </>
  );
};
