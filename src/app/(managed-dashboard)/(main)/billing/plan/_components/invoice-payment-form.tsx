"use client";

import { useState } from "react";
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
  cardsLength: number;
}

type PaymentIntentState = {
  pi_secret: null | string;
  message: null | string;
};

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const InvoicePaymentForm: React.FC<InvoicePaymentFormProps> = ({
  children,
  cardsLength,
}) => {
  const [showCards, setShowCards] = useState(true);
  const intentState = useLocalStorage<PaymentIntentState>(
    StorageItems.INVOICE_DATA
  );

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
        {showCards && (
          <>
            <PayWithSavedCard
              clientSecret={pi_secret}
              cardsLength={cardsLength}
            >
              {children}
            </PayWithSavedCard>
            <Button
              onClick={() => setShowCards(false)}
              type="button"
              variant="link"
              className="w-full"
            >
              <CreditCard className="w-6 h-6 mr-2" />
              <span>Use Another Payment Card</span>
            </Button>
          </>
        )}

        {!showCards && <PayWithNewCard clientSecret={pi_secret} />}
      </Elements>
    );
  }

  return null;
};
