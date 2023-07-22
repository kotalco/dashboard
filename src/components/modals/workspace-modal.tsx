"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWorkspaceModal } from "@/hooks/useWorkspaceModal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/client-instance";
import { Workspace } from "@/types";

const schema = z.object({
  name: z.string().min(3, "Workspace name must be 3 characters at least"),
});

export const WorksapceModal = () => {
  const storeModal = useWorkspaceModal();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    reset,
    setError,
    clearErrors,
  } = form;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const { data } = await client.post<Omit<Workspace, "role">>(
        "/workspaces",
        values
      );
      window.location.assign(`/${data.id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 409) {
          return setError("root", {
            type: response?.status.toString(),
            message: "Workspace name already used before.",
          });
        }

        return setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  };

  const onClose = () => {
    reset();
    clearErrors();
    storeModal.onClose();
  };

  return (
    <Modal
      title="Create New Workspace"
      description="Create a new workspace for your team and enjoy managing your nodes together."
      isOpen={storeModal.isOpen}
      onClose={onClose}
    >
      <div>
        <div className="py-2 pb-4 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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

              <div className="flex items-center justify-end w-full pt-6 space-x-2">
                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    (isSubmitted && !isValid) || isSubmitting || !isDirty
                  }
                  type="submit"
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
