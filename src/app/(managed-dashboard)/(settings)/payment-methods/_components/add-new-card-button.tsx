import { useState } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { delay } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const AddNewCardButton = () => {
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
        return_url: `${process.env["NEXT_PUBLIC_RETURN_URL_ROOT"]}/payments`,
      },
    });

    if (setupIntent) {
      await delay(300);
      window.location.reload();
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
