"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DeprecatedAlertModal } from "@/components/modals/deprecated-alert-modal";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/client-instance";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
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

const schema = z.object({
  name: z.string().min(1, "Please confirm node name"),
});

export interface DeleteEndpointProps {
  name: string;
}

type Schema = z.infer<typeof schema>;

export const DeleteEndpoint: React.FC<DeleteEndpointProps> = ({ name }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const {
    formState: { isSubmitting, errors },
    watch,
    setError,
  } = form;

  const endpointName = watch("name");

  const onSubmit = async () => {
    try {
      await client.delete(`/virtual-endpoints/${name}`);
      router.push(`/virtual-endpoints`);
      router.refresh();
      setOpen(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="mt-5 flex justify-end">
        <Button variant="destructive">Delete Endpoint</Button>
      </div>
      <DeprecatedAlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Endpoint"
        description={`This action cann't be undone. This will permnantly delete (${name}) Endpoint.`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Please type node name <strong>({name})</strong> to confirm
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
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

            <Button
              disabled={isSubmitting || endpointName !== name}
              data-testid="submit"
              variant="destructive"
              type="submit"
              className="absolute bottom-0 left-24"
            >
              Delete
            </Button>
          </form>
        </Form>
      </DeprecatedAlertModal>
    </>
  );
};
