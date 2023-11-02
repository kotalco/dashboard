"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { PolkadotNode } from "@/types";
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
import { useState } from "react";
import { DeprecatedAlertModal } from "@/components/modals/deprecated-alert-modal";

interface APITabProps {
  node: PolkadotNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { rpc, rpcPort, ws, wsPort, validator } = node;

  const schema = z
    .object({
      validator: z.boolean().optional(),
      rpc: z.boolean(),
      rpcPort: z.coerce
        .number({ invalid_type_error: "RPC Port is number" })
        .optional(),
      ws: z.boolean(),
      wsPort: z.coerce
        .number({ invalid_type_error: "WebSocket Port is number" })
        .optional(),
    })
    .refine(
      ({ rpc, rpcPort }) =>
        (rpc && rpcPort && rpcPort >= 1 && rpcPort <= 65535) || !rpc,
      {
        message:
          "RPC Port is required and must be a number between 1 and 65535",
        path: ["rpcPort"],
      }
    )
    .refine(
      ({ ws, wsPort }) =>
        (ws && wsPort && wsPort >= 1 && wsPort <= 65535) || !ws,
      {
        message:
          "WebSocket Port is required and must be a number between 1 and 65535",
        path: ["wsPort"],
      }
    )
    .transform(({ rpc, ...rest }) => {
      if (validator && rpc) {
        return { rpc, ...rest, validator: false };
      }
      return { rpc, ...rest };
    });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { rpc, rpcPort, ws, wsPort },
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
    setValue,
  } = form;

  const confirmRPC = () => {
    setValue("rpc", true, { shouldDirty: true });
    setIsOpen(false);
  };

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<PolkadotNode>(
        `/polkadot/nodes/${node.name}`,
        values
      );
      const { rpc, rpcPort, ws, wsPort } = data;
      reset({ rpc, rpcPort, ws, wsPort });
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
                    onCheckedChange={(value) => {
                      if (value && validator) {
                        setIsOpen(true);
                        return;
                      }
                      field.onChange(value);
                    }}
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
                  disabled={
                    isSubmitting || role === Roles.Reader || !watch("rpc")
                  }
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ws"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-x-3">
                <FormLabel className="mt-2">WebSocket Server</FormLabel>
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
            name="wsPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WebSocket Server Port</FormLabel>
                <Input
                  className="max-w-sm"
                  disabled={
                    isSubmitting || role === Roles.Reader || !watch("ws")
                  }
                  {...field}
                />
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
      <DeprecatedAlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Warning"
        description=" Activating RPC will disable Validator Port. Are you sure you want
          to continue?"
        onConfirm={confirmRPC}
      />
    </>
  );
};
