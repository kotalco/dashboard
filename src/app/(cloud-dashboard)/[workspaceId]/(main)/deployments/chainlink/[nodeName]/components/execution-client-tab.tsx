"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { ChainlinkNode, ExecutionClientNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { SelectWithInput } from "@/components/ui/select-with-input";
import { MultiSelect } from "@/components/ui/multi-select";

interface ExecutionClientTabProps {
  node: ChainlinkNode;
  role: Roles;
  executionClients: ExecutionClientNode[];
}

const schema = z.object({
  ethereumWsEndpoint: z
    .string({ required_error: "Ethereum websocket is required" })
    .min(1, "Ethereum websocket is required")
    .trim()
    .refine((value) => /wss?:\/\//.test(value), {
      message: "Invalid websocket URL",
    }),
  ethereumHttpEndpoints: z
    .array(z.string())
    .nullable()
    .refine(
      (value) =>
        !value || value.every((endpoint) => /https?:\/\//.test(endpoint)),
      {
        message: "Invalid HTTP URL",
      }
    ),
});

type Schema = z.infer<typeof schema>;

export const ExecutionClientTab: React.FC<ExecutionClientTabProps> = ({
  node,
  role,
  executionClients,
}) => {
  const { ethereumWsEndpoint, ethereumHttpEndpoints } = node;
  const wsActiveExecutionClients = executionClients
    .filter(({ ws }) => ws)
    .map(({ name, wsPort }) => ({
      label: name,
      value: `ws://${name}:${wsPort}`,
    }));

  const rpcActiveExecutionClients = executionClients
    .filter(({ rpc }) => rpc)
    .map(({ name, rpcPort }) => ({
      label: name,
      value: `http://${name}:${rpcPort}`,
    }));

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { ethereumHttpEndpoints, ethereumWsEndpoint },
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
      const { data } = await client.put<ChainlinkNode>(
        `/chainlink/nodes/${node.name}`,
        values
      );
      const { ethereumWsEndpoint, ethereumHttpEndpoints } = data;
      reset({ ethereumWsEndpoint, ethereumHttpEndpoints });
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
          name="ethereumWsEndpoint"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Execution Client Websocket Endpoint</FormLabel>
              <SelectWithInput
                placeholder="Select a Execution Client"
                disabled={isSubmitting || role === Roles.Reader}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={wsActiveExecutionClients}
                otherLabel="Externally Managed Node"
              />
              <FormDescription>
                Execution client nodes with WebSocket enabled
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ethereumHttpEndpoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Execution Clients HTTP Endpints</FormLabel>
              <div className="max-w-md">
                <MultiSelect
                  defaultValue={field.value || []}
                  disabled={role === Roles.Reader || isSubmitting}
                  value={field.value || []}
                  placeholder="Select execution clients nodes or enter your own endpoints"
                  options={rpcActiveExecutionClients}
                  onChange={field.onChange}
                  emptyText="Enter your own endpoints"
                  allowCustomValues
                />
                <FormDescription>
                  Select execution client nodes or enter your own endpoints
                </FormDescription>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Execution client settings have been updated successfully.
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
