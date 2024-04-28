import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useElements, useStripe } from "@stripe/react-stripe-js";

import { useShowCards } from "@/hooks/useShowCards";
import { delay, getBaseURL } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export const AddNewCardButton = () => {
  const { setShowCards } = useShowCards();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const stripe = useStripe();
  const elements = useElements();

  const addNewPaymentMethod = async () => {
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${getBaseURL()}/billing/plan`,
      },
    });

    if (setupIntent) {
      await delay(1000);
      router.refresh();
      setShowCards(true);
      setIsLoading(false);
    }

    if (error) {
      setMessage(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {message && (
        <Alert variant="destructive" className="text-center">
          {message}
        </Alert>
      )}
      <Button disabled={isLoading} onClick={addNewPaymentMethod}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-3" />}
        Add Card
      </Button>
    </>
  );
};
