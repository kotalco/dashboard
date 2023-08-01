import * as z from "zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
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
import { StorageItems } from "@/enums";
import { LoginResponse } from "@/types";

interface Verification2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = z.object({
  totp: z.string().length(6, "Your code must be 6 digits"),
});

type SchemaType = z.infer<typeof schema>;
const defaultValues = { totp: "" };

export const Verification2FAModal: React.FC<Verification2FAModalProps> = ({
  isOpen,
  onClose,
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
      const {
        data: { token },
      } = await client.post<LoginResponse>("/users/totp/verify", values);
      localStorage.setItem(StorageItems.AUTH_TOKEN, token);
      await axios.post("/set-cookie", {
        name: StorageItems.AUTH_TOKEN,
        value: token,
      });
      router.replace("/");
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
      title="Verification Required"
      description="Enter the code shown in your authenticator app"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          data-testid="verification-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
              data-testid="submit-verification"
              size="lg"
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              type="submit"
            >
              Complete Login
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
