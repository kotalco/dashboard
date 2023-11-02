"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

const CancelPlan = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="destructive">
        Cancel Subscription
      </Button>

      <AlertModal
        title="Cancel Subscription"
        description="Are you sure you want to Cancel your subscription? You will lose all your data."
        isOpen={open}
        onClose={() => setOpen(false)}
        // onConfirm={handleCancelSubscription}
        onConfirm={() => {}}
      />
    </>
  );
};
export default CancelPlan;
