import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";

import { delay, formatCurrency, getBaseURL } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface PayWithSavedCardProps {
  clientSecret: string;
  children: React.ReactNode;
  cardsLength: number;
}

export const PayWithSavedCard: React.FC<PayWithSavedCardProps> = ({
  clientSecret,
  children,
  cardsLength,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const stripe = useStripe();
  const elements = useElements();

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

  const payInvoice = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardId = formData.get("cardId") as string;

    if (!stripe || !cardId) return;

    setIsLoading(true);
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: cardId,
      return_url: `${getBaseURL()}}/billing/plan`,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }
    await delay(3000);
    window.location.reload();
  };

  if (!amount) return null;

  return (
    <form onSubmit={payInvoice} className="space-y-2">
      {children}
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
      <Button className="w-full" disabled={isLoading || !cardsLength}>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Pay{" "}
        {formatCurrency(amount)}
      </Button>
    </form>
  );
};
