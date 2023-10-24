"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BeaconNode, ValidatorNode } from "@/types";
import { BeaconNodeClients, Roles, ValidatorClients } from "@/enums";
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
import { MultiSelect } from "@/components/ui/multi-select";

interface BeaconNodeTabProps {
  node: ValidatorNode;
  role: Roles;
  beaconNodes: BeaconNode[];
}

export const BeaconNodeTab: React.FC<BeaconNodeTabProps> = ({
  node,
  role,
  beaconNodes,
}) => {
  const { beaconEndpoints } = node;

  const activeBeaconNods = beaconNodes
    .filter(({ client, rest, rpc }) =>
      client === BeaconNodeClients["ConsenSys Teku"] ||
      client === BeaconNodeClients["Sigma Prime Lighthouse"]
        ? rest
        : rpc
    )
    .map(({ name, client, rpcPort, restPort }) => ({
      label: name,
      value: `http://${name}:${
        client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"]
          ? restPort
          : rpcPort
      }`,
    }));

  const schema = z.object({
    beaconEndpoints: z
      .string({ required_error: "Beacon node endpoints are required" })
      .array()
      .nonempty({ message: "Beacon node endpoints are required" })
      .refine(
        (value) =>
          (node.client !== ValidatorClients["Sigma Prime Lighthouse"] &&
            value.length === 1) ||
          node.client === ValidatorClients["Sigma Prime Lighthouse"],
        {
          message: "Beacon node endpoint requires only 1 endpoint",
        }
      ),
  });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { beaconEndpoints },
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
      const { data } = await client.put<ValidatorNode>(
        `/ethereum2/validators/${node.name}`,
        values
      );
      const { beaconEndpoints } = data;
      reset({ beaconEndpoints });
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
          name="beaconEndpoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beacon Node Endpoints</FormLabel>
              <div className="max-w-sm">
                <MultiSelect
                  defaultValue={field.value}
                  disabled={role === Roles.Reader || isSubmitting}
                  value={field.value}
                  placeholder="Select beacon nodes or enter your own endpoints"
                  options={activeBeaconNods}
                  onChange={field.onChange}
                  emptyText="Enter your own endpoints"
                  allowCustomValues
                />
                <FormDescription>
                  Select beacon nodes or enter your own endpoints
                </FormDescription>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Beacon node endpoints settings have been updated successfully.
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
