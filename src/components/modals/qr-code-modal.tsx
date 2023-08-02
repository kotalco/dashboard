import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OTPInput } from "@/components/ui/otp-input";
import { client } from "@/lib/client-instance";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrImageUrl: string;
}

const schema = z.object({
  totp: z.string().length(6, "Your code must be 6 digits"),
});

type SchemaType = z.infer<typeof schema>;
const defaultValues = { totp: "" };

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrImageUrl,
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  if (!isMounted) return null;

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    reset,
    clearErrors,
    setError,
  } = form;

  async function onSubmit(values: SchemaType) {
    try {
      await client.post("/users/totp/enable", values);
      router.refresh();
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;
        response?.status === 400 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Invalid OTP Code.",
          });

        response?.status !== 400 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Something went wrong.",
          });
      }
    }
  }

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  return (
    <Modal
      title="Enable Two Factor Authentication"
      description="Scan the image below with the two-factor authentication application from your phone"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          data-testid="qr-code-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
            After scanning the QR image, the application will display a code
            that you can enter below
          </p>
          <FormField
            control={form.control}
            name="totp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OTPInput
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="flex justify-center w-full">
            <Button
              data-testid="submit"
              size="lg"
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              type="submit"
            >
              Verify
            </Button>
          </div>

          {errors.root && (
            <Alert variant="destructive" className="text-center">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </Modal>
  );
};
