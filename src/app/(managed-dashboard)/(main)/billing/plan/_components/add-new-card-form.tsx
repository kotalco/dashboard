"use client";

import { useTheme } from "next-themes";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { AddNewCardButton } from "./add-new-card-button";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddNewCardFormProps {
  si_secret: string;
}

export const AddNewCardForm: React.FC<AddNewCardFormProps> = ({
  si_secret,
}) => {
  const { theme } = useTheme();

  return (
    <Elements
      options={{
        clientSecret: si_secret,
        appearance: { theme: theme === "dark" ? "night" : "stripe" },
      }}
      stripe={stripe}
    >
      <PaymentElement />
      <AddNewCardButton />
    </Elements>
  );
};
