import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { ProcessPayment } from "./process-payment";

interface PaymentElementProps {
  data: { clientSecret: string; cardId: string };
}

const stripe = loadStripe(process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]!);

export const PaymentElement: React.FC<PaymentElementProps> = ({ data }) => {
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
