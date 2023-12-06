import { Dispatch, SetStateAction } from "react";

import { useAction } from "@/hooks/use-action";
import { confirmChange2fa } from "@/actions/confirm-change-2fa";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  setQrImageUrl: Dispatch<SetStateAction<string>>;
  enabled: boolean;
}

export const TwoFAModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  setQrImageUrl,
  enabled,
}) => {
  const { execute, fieldErrors, error } = useAction(confirmChange2fa, {
    onSuccess: (response) => {
      if (response.imageUrl) {
        setQrImageUrl(`data:image/png;base64,${response.imageUrl}`);
      }
      onClose();
    },
  });

  const onSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    execute({ password }, { enabled });
  };

  return (
    <Modal
      title={`${enabled ? "Disable" : "Enable"} Two Factor Authentication`}
      description="Please confirm your password first"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form data-testid="password-form" action={onSubmit} className="space-y-4">
        <Input
          id="password"
          type="password"
          label="Your Password"
          errors={fieldErrors}
        />

        <SubmitError error={error} />

        <div className="flex items-center w-full space-x-2">
          <Button
            data-testid="cancel"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <SubmitButton>Continue</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
