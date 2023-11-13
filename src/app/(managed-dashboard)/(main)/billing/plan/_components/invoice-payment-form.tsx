"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Alert } from "@/components/ui/alert";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StorageItems } from "@/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { PayWithSavedCard } from "./pay-with-saved-card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { PayWithNewCard } from "./pay-with-new-card";

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
  const [showCards, setShowCards] = useState(true);
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
          {showCards && children}
          {state.message && (
            <Alert variant="destructive">{state.message}</Alert>
          )}
          {showCards && (
            <>
              <Button
                onClick={() => setShowCards(false)}
                variant="link"
                className="w-full"
              >
                <CreditCard className="w-6 h-6 mr-2" />
                <span>Use Another Payment Card</span>
              </Button>
              <PayWithSavedCard
                clientSecret={pi_secret}
                cardId={state.cardId}
              />
            </>
          )}

          {!showCards && <PayWithNewCard clientSecret={pi_secret} />}
        </form>
      </Elements>
    );
  }

  return null;
};
