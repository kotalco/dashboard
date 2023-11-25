"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { AptosNode, FilecoinNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { InputWithUnit } from "@/components/form/input-with-unit";

interface APITabProps {
  node: FilecoinNode;
  role: Roles;
}

const schema = z
  .object({
    api: z.boolean(),
    apiRequestTimeout: z.coerce
      .number({
        invalid_type_error: "Please enter a valid number with seconds",
      })
      .min(1, "Please enter a valid number with seconds"),
  })
  .transform(({ api, apiRequestTimeout }) =>
    api ? { api, apiRequestTimeout } : { api }
  );

type Schema = z.input<typeof schema>;

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { api, apiRequestTimeout } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { api, apiRequestTimeout },
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
    watch,
  } = form;

  const [apiState] = watch(["api"]);

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<FilecoinNode>(
        `/filecoin/nodes/${node.name}`,
        values
      );
      const { api, apiRequestTimeout } = data;
      reset({ api, apiRequestTimeout });
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
          name="api"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">REST</FormLabel>
              <FormControl>
                <Switch
                  disabled={isSubmitting || role === Roles.Reader}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiRequestTimeout"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>API Request Timeout</FormLabel>
              <FormControl>
                <InputWithUnit
                  disabled={isSubmitting || role === Roles.Reader || !apiState}
                  unit={`Second${+field.value !== 1 ? "s" : ""}`}
                  value={field.value.toString()}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              API settings have been updated successfully.
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
