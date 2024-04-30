"use client";

import { useState } from "react";

import { useAction } from "@/hooks/use-action";
import { cancelPlan } from "@/actions/cancel-plan";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface CancelPlanProps {
  subscriptionId: string;
}

export const CancelPlan: React.FC<CancelPlanProps> = ({ subscriptionId }) => {
  const [open, setOpen] = useState(false);

  const { execute, error } = useAction(cancelPlan, {
    onSuccess: () => setOpen(false),
  });

  const onSubmit = () => {
    execute({ subscription_id: subscriptionId });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="destructive">
        Cancel Subscription
      </Button>

      <Modal
        title="Cancel Subscription"
        description="Are you sure you want to Cancel your subscription? You will lose all your data."
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <form action={onSubmit} className="space-y-3">
          <div className="space-x-4">
            <Button
              type="button"
              data-testid="cancel-button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton variant="destructive">Continue</SubmitButton>
          </div>
          <SubmitError error={error} />
        </form>
      </Modal>
    </>
  );
};
