"use client";

import { useFormState } from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StorageItems } from "@/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { PayWithSavedCard } from "./pay-with-saved-card";

interface InvoicePaymentFormProps {
  children: React.ReactNode;
}

type PaymentIntentState = {
  pi_secret: null | string;
  message: null | string;
};

type PayInvoiceState = { message: null | string; cardId: null | string };

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const InvoicePaymentForm: React.FC<InvoicePaymentFormProps> = ({
  children,
}) => {
  const intentState = useLocalStorage<PaymentIntentState>(
    StorageItems.INVOICE_DATA
  );
  const getCardId = async (_: PayInvoiceState, formData: FormData) => {
    const cardId = formData.get("cardId");
    if (typeof cardId === "string") {
      return { cardId, message: null };
    }
    return { cardId: null, message: "Please select a card" };
  };
  const [state, dispatch] = useFormState(getCardId, {
    message: null,
    cardId: null,
  });

  if (!intentState)
    return (
      <div className="space-y-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );

  const { message, pi_secret } = intentState;

  if (message) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  if (pi_secret) {
    return (
      <Elements
        options={{
          clientSecret: pi_secret,
          appearance: { theme: "stripe" },
        }}
        stripe={stripe}
      >
        <form action={dispatch} className="space-y-2">
          {children}
          {state.message && (
            <Alert variant="destructive">{state.message}</Alert>
          )}
          <PayWithSavedCard clientSecret={pi_secret} cardId={state.cardId} />
        </form>
      </Elements>
    );
  }

  return null;
};
