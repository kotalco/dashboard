import { Alert } from "@/components/ui/alert";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { AddNewCardButton } from "./add-new-card-button";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddNewCardFormProps {
  state: { message: null | string; si_secret: null | string };
}

export const AddNewCardForm: React.FC<AddNewCardFormProps> = ({ state }) => {
  if (!state.message && !state.si_secret)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );

  if (state.message)
    return <Alert variant="destructive">{state.message}</Alert>;

  if (state.si_secret) {
    return (
      <Elements
        options={{
          clientSecret: state.si_secret,
          appearance: { theme: "stripe" },
        }}
        stripe={stripe}
      >
        <PaymentElement />
        <AddNewCardButton />
      </Elements>
    );
  }

  return null;
};
