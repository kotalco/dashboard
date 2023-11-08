import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";

interface InvoicePaymentFormProps {
  state: { message: null | string; pi_secret: null | string };
}

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const InvoicePaymentForm: React.FC<InvoicePaymentFormProps> = ({
  state: { pi_secret: clientSecret, message },
}) => {
  if (!message && !clientSecret)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );

  if (message) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  if (clientSecret) {
    return (
      <Elements
        options={{
          clientSecret,
          appearance: { theme: "stripe" },
        }}
        stripe={stripe}
      >
        adsakljdklsajdkl
      </Elements>
    );
  }

  return null;
};
