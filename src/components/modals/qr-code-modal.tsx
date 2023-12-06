import Image from "next/image";
import { usePathname } from "next/navigation";

import { enable2fa } from "@/actions/enable-2fa";
import { useAction } from "@/hooks/use-action";

import { Modal } from "@/components/ui/modal";
import { OTPInput } from "@/components/form/otp-input";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrImageUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrImageUrl,
}) => {
  const pathname = usePathname();
  const { execute, error, fieldErrors } = useAction(enable2fa, {
    onSuccess: () => {
      onClose();
    },
  });

  const onSubmit = (formData: FormData) => {
    const totp = formData.getAll("totp") as string[];

    execute({ totp: totp.join("") }, { pathname });
  };

  return (
    <Modal
      title="Enable Two Factor Authentication"
      description="Scan the image below with the two-factor authentication application from your phone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form data-testid="qr-code-form" action={onSubmit} className="space-y-4">
        {qrImageUrl && (
          <Image
            src={qrImageUrl}
            alt="QR Code"
            width={170}
            height={170}
            className="mx-auto"
            unoptimized
          />
        )}
        <p className="text-center">
          After scanning the QR image, the application will display a code that
          you can enter below
        </p>

        <OTPInput id="totp" errors={fieldErrors} />

        <SubmitError error={error} />

        <div className="flex justify-center w-full">
          <SubmitButton size="lg">Verify</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
