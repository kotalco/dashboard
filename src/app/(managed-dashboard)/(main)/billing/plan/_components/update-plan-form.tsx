"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { updatePlan } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { ProrationFormState } from "@/types";
import { PaymentElement } from "./payment-element";

interface UpdatePlanFormProps {
  children: React.ReactNode;
  data: Exclude<ProrationFormState["data"], null>;
}

type InitialState = {
  message: string | null;
  data: { clientSecret: string; cardId: string; isLoading?: boolean } | null;
};

export const UpdatePlanForm: React.FC<UpdatePlanFormProps> = ({
  children,
  data,
}) => {
  const initialState: InitialState = { message: null, data: null };
  const [state, dispatch] = useFormState(
    updatePlan.bind(null, data),
    initialState
  );

  return (
    <>
      <form
        action={dispatch}
        className="w-7/12 pl-6 flex flex-col justify-between"
      >
        {children}
        {state.message && (
          <Alert variant="destructive" className="text-center">
            {state.message}
          </Alert>
        )}
        <PaymentElement data={state.data} />
        <PayButton
          amount={data.proration.amount_due}
          disabled={state.data?.isLoading}
        />
      </form>
    </>
  );
};

const PayButton: React.FC<{ disabled?: boolean; amount: number }> = ({
  amount,
  disabled,
}) => {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button className="w-full" disabled={pending || disabled}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Pay {formatCurrency(amount)}
      </Button>
    </div>
  );
};
