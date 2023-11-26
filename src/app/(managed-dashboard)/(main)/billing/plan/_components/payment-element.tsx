import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { ProcessPayment } from "./process-payment";
import { useEffect } from "react";

interface PaymentElementProps {
  data: { clientSecret: string; cardId: string; isLoading?: boolean } | null;
}

const stripe = loadStripe(process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]!);

export const PaymentElement: React.FC<PaymentElementProps> = ({ data }) => {
  useEffect(() => {
    if (!data?.clientSecret && !data?.cardId && data?.isLoading) {
      window.location.reload();
    }
  }, [data?.cardId, data?.clientSecret, data?.isLoading]);

  if (!data?.clientSecret) return null;

  const { clientSecret } = data;
  return (
    <Elements
      options={{ clientSecret, appearance: { theme: "stripe" } }}
      stripe={stripe}
    >
      <ProcessPayment data={data} />
    </Elements>
  );
};
