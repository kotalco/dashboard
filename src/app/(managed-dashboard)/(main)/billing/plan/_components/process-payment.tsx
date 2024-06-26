import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";

import { Alert } from "@/components/ui/alert";
import { delay, getBaseURL } from "@/lib/utils";

interface ProcessPaymentProps {
  data: { clientSecret: string; cardId: string };
}

export const ProcessPayment: React.FC<ProcessPaymentProps> = ({ data }) => {
  const [message, setMessage] = useState<string>();
  const { refresh } = useRouter();
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
          return_url: `${getBaseURL()}/billing/plan`,
        }
      );

      if (error) {
        setMessage(error.message);
        refresh();
        return;
      }

      if (paymentIntent) {
        await delay(1000);
        window.location.reload();
      }
    };

    processPayment();
  }, [cardId, clientSecret, elements, refresh, stripe]);

  if (message) {
    return (
      <Alert variant="destructive" className="text-center">
        {message}
      </Alert>
    );
  }

  return null;
};
