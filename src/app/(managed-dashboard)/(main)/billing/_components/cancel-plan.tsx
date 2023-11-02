"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cancelSubscription } from "@/lib/actions";

interface CancelPlanProps {
  subscriptionId: string;
}

export const CancelPlan: React.FC<CancelPlanProps> = ({ subscriptionId }) => {
  const initialState = { message: null };
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useFormState<{ message: null | string }>(
    cancelSubscription.bind(null, subscriptionId),
    initialState
  );

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
        <form action={dispatch} className="space-y-3">
          <Buttons onClose={() => setOpen(false)} />
          {state.message && (
            <p key={state.message} className="text-destructive text-xs">
              {state.message}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
};

const Buttons: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-x-4">
      <Button
        type="button"
        data-testid="cancel-button"
        disabled={pending}
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        data-testid="confirm-button"
        disabled={pending}
        variant="destructive"
      >
        Continue
      </Button>
    </div>
  );
};
