"use client";

import { useActivationModal } from "@/hooks/useActivationModal";
import { useAction } from "@/hooks/use-action";
import { activateLiscense } from "@/actions/activate-liscense";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/form/textarea";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

export const ActivationModal = () => {
  const activationModal = useActivationModal();
  const { execute, error, fieldErrors } = useAction(activateLiscense);

  const onSubmit = (formData: FormData) => {
    const activation_key = formData.get("activation_key") as string;
    execute({ activation_key });
  };

  return (
    <Modal
      title="Subscription Activation"
      description="Please enter your activation key to continue"
      isOpen={activationModal.isOpen}
      onClose={activationModal.onClose}
    >
      <div>
        <form action={onSubmit} className="py-2 pb-4 space-y-4">
          <Textarea
            id="activation_key"
            label="Activation Key"
            errors={fieldErrors}
            placeholder="Activation Key"
          />

          <SubmitError error={error} />

          <div className="flex items-center justify-end w-full pt-6 space-x-2">
            <Button
              variant="outline"
              onClick={activationModal.onClose}
              type="button"
            >
              Cancel
            </Button>
            <SubmitButton>Continue</SubmitButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};
