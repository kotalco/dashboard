import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/client-instance";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  setQrImageUrl: Dispatch<SetStateAction<string>>;
  enabled: boolean;
}

const schema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be not less than 6 characters"),
});

type SchemaType = z.infer<typeof schema>;
const defaultValues = { password: "" };

export const TwoFAModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  setQrImageUrl,
  enabled,
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

  const onCloseModal = () => {
    reset();
    clearErrors();
    onClose();
  };

  async function onSubmit(values: SchemaType) {
    try {
      if (!enabled) {
        const { data } = await client.post<Blob>("/users/totp", values, {
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(data);
        setQrImageUrl(imageUrl);
      } else {
        await client.post<Blob>("/users/totp/disable", values);
        router.refresh();
      }
      onCloseModal();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;
        response?.status === 400 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Incorrect password.",
          });

        response?.status !== 400 &&
          setError("root", {
            type: response?.status.toString(),
            message: "Something went wrong.",
          });
      }
    }
  }

  return (
    <Modal
      title={`${enabled ? "Disable" : "Enable"} Two Factor Authentication`}
      description="Please confirm your password first"
      isOpen={isOpen}
      onClose={onCloseModal}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center w-full space-x-2">
            <Button
              type="button"
              disabled={isSubmitting}
              variant="outline"
              onClick={onCloseModal}
            >
              Cancel
            </Button>

            <Button
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              type="submit"
            >
              Continue
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
