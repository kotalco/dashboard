"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { NEARNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface PrometheusTabProps {
  node: NEARNode;
  role: Roles;
}

const schema = z.object({
  prometheusPort: z.coerce
    .number({ invalid_type_error: "Prometheus Port is number" })
    .min(1, "Prometheus Port is between 1 and 65535")
    .max(65535, "Prometheus Port is between 1 and 65535")
    .optional()
    .default(9615),
});

type Schema = z.input<typeof schema>;

export const PrometheusTab: React.FC<PrometheusTabProps> = ({ node, role }) => {
  const { prometheusPort } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { prometheusPort },
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
      const { data } = await client.put<NEARNode>(
        `/near/nodes/${node.name}`,
        values
      );
      const { prometheusPort } = data;
      reset({ prometheusPort });
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
        className="relative space-y-4"
      >
        <FormField
          control={form.control}
          name="prometheusPort"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Prometheus Port</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting || role === Roles.Reader}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Prometheus settings have been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {role !== Roles.Reader && (
          <TabsFooter>
            <Button
              disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
              data-testid="submit"
              type="submit"
            >
              Save
            </Button>
          </TabsFooter>
        )}
      </form>
    </Form>
  );
};
