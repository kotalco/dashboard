"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { prepareInvoicePayment } from "@/lib/actions";
import { Loader2 } from "lucide-react";

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
    <div className="bg-[#F2C94C] px-2 bg-opacity-20 rounded-md inline-block">
      <form action={dispatch}>
        <ContinuePaymentButton />
      </form>
      {state.message && (
        <p className="text-red-700" key={state.message}>
          {state.message}
        </p>
      )}
    </div>
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
