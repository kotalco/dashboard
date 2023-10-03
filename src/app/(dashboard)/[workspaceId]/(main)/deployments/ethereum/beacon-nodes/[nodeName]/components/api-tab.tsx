"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BeaconNode } from "@/types";
import { BeaconNodeClients, Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";

interface APITabProps {
  node: BeaconNode;
  role: Roles;
}

const schema = z.object({
  rest: z.boolean().optional(),
  rpc: z.boolean().optional(),
  grpc: z.boolean().optional(),
});

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const params = useParams();
  const { rest, rpc, grpc } = node;

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { rpc, rest, grpc },
    shouldUnregister: true,
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
      const { data } = await client.put<BeaconNode>(
        `/ethereum2/beaconnodes/${node.name}`,
        values
      );
      const { rest, rpc, grpc } = data;
      reset({ rpc, rest, grpc });
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
        {(node.client === BeaconNodeClients["ConsenSys Teku"] ||
          node.client === BeaconNodeClients["Sigma Prime Lighthouse"] ||
          node.client === BeaconNodeClients["Status.im Nimbus"]) && (
          <FormField
            control={form.control}
            name="rest"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-3">
                  <FormLabel className="text-base">REST API Server</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isSubmitting || role === Roles.Reader}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        )}

        {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
          <FormField
            control={form.control}
            name="rpc"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-3">
                  <FormLabel className="text-base">JSON-RPC Server</FormLabel>
                  <FormControl>
                    <Switch
                      disabled
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  JSON-RPC Server cann&apos;t be disabled for Prysm.
                </FormDescription>
              </FormItem>
            )}
          />
        )}

        {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
          <FormField
            control={form.control}
            name="grpc"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-3">
                  <FormLabel className="text-base">
                    GRPC Gateway Server
                  </FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isSubmitting || role === Roles.Reader}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        )}

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
