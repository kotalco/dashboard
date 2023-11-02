"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { reactivatePlan } from "@/lib/actions";

interface ReactivatePlanProps {
  subscriptionId: string;
}

export const ReactivatePlan: React.FC<ReactivatePlanProps> = ({
  subscriptionId,
}) => {
  const initialState = { message: null };
  const [state, dispatch] = useFormState<{ message: null | string }>(
    reactivatePlan.bind(null, subscriptionId),
    initialState
  );

  return (
    <>
      <form action={dispatch}>
        <ReactivateButton />
      </form>
      {state.message && (
        <p key={state.message} className="text-destructive text-xs">
          {state.message}
        </p>
      )}
    </>
  );
};

export const ReactivateButton = () => {
  const { pending } = useFormStatus();

  return <Button disabled={pending}>Reactivate Subscription</Button>;
};
