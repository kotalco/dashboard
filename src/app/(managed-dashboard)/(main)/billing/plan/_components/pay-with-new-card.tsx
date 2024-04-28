import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

import { delay, formatCurrency, getBaseURL } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface PayWithNewCardProps {
  clientSecret: string;
}

export const PayWithNewCard: React.FC<PayWithNewCardProps> = ({
  clientSecret,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>();
  const stripe = useStripe();
  const elements = useElements();
  console.log("PayWithNewCard");
  useEffect(() => {
    if (!elements || !stripe) {
      return;
    }

    const getPaymentAmount = async () => {
      setIsLoading(true);
      const { paymentIntent, error } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      if (paymentIntent) {
        setAmount(paymentIntent.amount);
        setIsLoading(false);
      }

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    };

    getPaymentAmount();
  }, [clientSecret, elements, stripe]);

  const payInvoice = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${getBaseURL()}/billing/plan`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    window.location.reload();
  };

  if (!amount) return null;

  return (
    <>
      <PaymentElement />
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
      <div className="mt-5">
        <Button className="w-full" disabled={isLoading} onClick={payInvoice}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Pay{" "}
          {formatCurrency(amount)}
        </Button>
      </div>
    </>
  );
};
