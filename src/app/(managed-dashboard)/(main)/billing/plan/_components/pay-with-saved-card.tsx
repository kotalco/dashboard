import { FormEvent, useEffect, useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface PayWithSavedCardProps {
  clientSecret: string;
  children: React.ReactNode;
}

export const PayWithSavedCard: React.FC<PayWithSavedCardProps> = ({
  clientSecret,
  children,
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
      return_url: `${process.env["NEXT_PUBLIC_RETURN_URL_ROOT"]}/billing/plan`,
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
    <form onSubmit={payInvoice} className="space-y-2">
      {children}
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
      <Button className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Pay{" "}
        {formatCurrency(amount)}
      </Button>
    </form>
  );
};
