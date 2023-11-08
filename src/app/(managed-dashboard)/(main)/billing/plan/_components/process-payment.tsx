import { useEffect, useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";

import { Alert } from "@/components/ui/alert";

interface ProcessPaymentProps {
  data: { clientSecret: string; cardId: string };
}

export const ProcessPayment: React.FC<ProcessPaymentProps> = ({ data }) => {
  const [message, setMessage] = useState<string>();
  const stripe = useStripe();
  const elements = useElements();
  const { clientSecret, cardId } = data;

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const processPayment = async () => {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: cardId,
          return_url: `${process.env["NEXT_PUBLIC_RETURN_URL_ROOT"]}/billing/plan`,
        }
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      if (paymentIntent) {
        window.location.reload();
      }
    };

    processPayment();
  }, [cardId, clientSecret, elements, stripe]);

  if (message) {
    return (
      <Alert variant="destructive" className="text-center">
        {message}
      </Alert>
    );
  }

  return null;
};
