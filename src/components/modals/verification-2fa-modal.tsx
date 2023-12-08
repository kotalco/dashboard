import { useAction } from "@/hooks/use-action";
import { authorizeUser } from "@/actions/authorize-user";

import { Modal } from "@/components/ui/modal";
import { OTPInput } from "@/components/form/otp-input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface Verification2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Verification2FAModal: React.FC<Verification2FAModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { execute, error, fieldErrors } = useAction(authorizeUser, {
    onComplete: ({ data }) => {
      if (data) {
        onClose();
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    const totp = formData.getAll("totp") as string[];
    execute({ totp: totp.join("") });
  };

  return (
    <Modal
      title="Verification Required"
      description="Enter the code shown in your authenticator app"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        data-testid="verification-form"
        action={onSubmit}
        className="space-y-4"
      >
        <OTPInput id="totp" errors={fieldErrors} />

        <SubmitError error={error} />

        <div className="flex justify-center w-full">
          <SubmitButton size="lg">Complete Login</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
