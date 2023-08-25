"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { AptosNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface APITabProps {
  node: AptosNode;
  role: Roles;
}

const schema = z.object({
  api: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { api } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { api },
  });

  const {
    formState: {
      isSubmitted,
      isSubmitting,
      isValid,
      isDirty,
      isSubmitSuccessful,
      errors,
    },
    reset,
    setError,
  } = form;

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<AptosNode>(
        `/aptos/nodes/${node.name}`,
        values
      );
      reset({ api: data.api });
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-8"
      >
        <FormField
          control={form.control}
          name="api"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">REST</FormLabel>
              <FormControl>
                <Switch
                  disabled={role === Roles.Reader}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="absolute text-center -bottom-24">
            <AlertDescription>
              API settings have been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert
            variant="destructive"
            className="absolute text-center -bottom-24"
          >
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {role !== Roles.Reader && (
          <div className="flex flex-row-reverse items-center px-4 py-3 -mx-4 space-x-2 space-x-reverse translate-y-4 rounded-b bg-muted/80 sm:-mx-6 sm:px-6">
            <Button
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              data-testid="submit"
              type="submit"
            >
              Save
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
