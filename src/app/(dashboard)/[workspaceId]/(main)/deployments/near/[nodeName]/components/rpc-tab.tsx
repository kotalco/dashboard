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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface RPCTabProps {
  node: NEARNode;
  role: Roles;
}

const schema = z
  .object({
    rpc: z.boolean(),
    rpcPort: z.coerce
      .number({ invalid_type_error: "RPC Port is number" })
      .optional(),
  })
  .refine(
    ({ rpc, rpcPort }) =>
      (rpc && rpcPort && rpcPort >= 1 && rpcPort <= 65535) || !rpc,
    {
      message: "RPC Port is required and must be a number between 1 and 65535",
      path: ["rpcPort"],
    }
  );

type Schema = z.infer<typeof schema>;

export const RPCTab: React.FC<RPCTabProps> = ({ node, role }) => {
  const { rpc, rpcPort } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { rpc, rpcPort },
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
    watch,
    setError,
  } = form;

  const rpcState = watch("rpc");

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<NEARNode>(
        `/near/nodes/${node.name}`,
        values
      );
      const { rpc, rpcPort } = data;
      reset({ rpc, rpcPort });
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
          name="rpc"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2">JSON-RPC Server</FormLabel>
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
          name="rpcPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>JSON-RPC Port</FormLabel>
              <Input
                className="max-w-sm"
                disabled={isSubmitting || role === Roles.Reader || !rpcState}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              RPC settings have been updated successfully.
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
