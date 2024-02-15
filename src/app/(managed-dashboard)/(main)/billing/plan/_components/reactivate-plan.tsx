"use client";

import { useAction } from "@/hooks/use-action";
import { reactivatePlan } from "@/actions/reactivate-plan";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface ReactivatePlanProps {
  subscriptionId: string;
}

export const ReactivatePlan: React.FC<ReactivatePlanProps> = ({
  subscriptionId,
}) => {
  const { execute, error } = useAction(reactivatePlan);
  const onSubmit = () => {
    execute({ subscription_id: subscriptionId, provider: "stripe" });
  };

  return (
    <>
      <form action={onSubmit}>
        <SubmitButton>Reactivate Subscription</SubmitButton>
      </form>
      <SubmitError error={error} />
    </>
  );
};
