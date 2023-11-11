"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useActivationModal } from "@/hooks/useActivationModal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client-instance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  activation_key: z
    .string({ required_error: "Activation key is required" })
    .min(1, "Activation key is required"),
});

export const ActivationModal = () => {
  const activationModal = useActivationModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { activation_key: "" },
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    setError,
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await client.post(
        "/subscriptions/acknowledgment",
        values
      );
      window.location.assign(`/sign-in`);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 500) {
          return setError("root", {
            type: response?.status.toString(),
            message: "Can't activate subscription.",
          });
        }

        return setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  };

  return (
    <Modal
      title="Subscription Activation"
      description="Please enter your activation key to continue"
      isOpen={activationModal.isOpen}
      onClose={activationModal.onClose}
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-2 pb-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="activation_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activation Key</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      disabled={isSubmitting}
                      placeholder="Activation Key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors.root && (
              <Alert variant="destructive" className="text-center">
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-end w-full pt-6 space-x-2">
              <Button
                disabled={isSubmitting}
                variant="outline"
                onClick={activationModal.onClose}
                type="button"
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
          </form>
        </Form>
      </div>
    </Modal>
  );
};
