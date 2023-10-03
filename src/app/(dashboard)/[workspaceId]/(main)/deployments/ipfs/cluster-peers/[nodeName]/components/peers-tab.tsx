"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
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

interface PeersTabProps {
  node: IPFSClusterPeer;
  role: Roles;
  peers: IPFSPeer[];
  clusterPeers: IPFSClusterPeer[];
}

const schema = z.object({
  peerEndpoint: z
    .string({ required_error: "Peer endpoint is required" })
    .min(1, "Peer endpoint is required")
    .trim(),
  bootstrapPeers: z.string().array().optional(),
});

type Schema = z.infer<typeof schema>;

export const PeersTab: React.FC<PeersTabProps> = ({
  node,
  role,
  peers,
  clusterPeers,
}) => {
  const { peerEndpoint, bootstrapPeers } = node;
  const peerEndpoints = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const ipfsClusterPeers = clusterPeers.map(({ name, id }) => ({
    label: name,
    value: `/dns4/${name}/tcp/9096/p2p/${id}`,
  }));

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { peerEndpoint, bootstrapPeers },
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
      const { data } = await client.put<IPFSClusterPeer>(
        `/ipfs/clusterpeers/${node.name}`,
        values
      );
      const { peerEndpoint, bootstrapPeers } = data;
      reset({ peerEndpoint, bootstrapPeers });
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
          name="peerEndpoint"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>IPFS Peer</FormLabel>
              <SelectWithInput
                placeholder="Select a Peer"
                disabled={isSubmitting || role === Roles.Reader}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={peerEndpoints}
                otherLabel="Use External Peer"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          shouldUnregister={true}
          control={form.control}
          name="bootstrapPeers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bootstrap Cluster Peers</FormLabel>
              <div>
                <div className="max-w-xs">
                  <MultiSelect
                    defaultValue={field.value}
                    disabled={isSubmitting || role === Roles.Reader}
                    value={field.value}
                    placeholder="Select bootstrap peers"
                    options={ipfsClusterPeers}
                    onChange={field.onChange}
                    emptyText="Enter your own peers"
                    allowCustomValues
                  />
                </div>
                <FormDescription>
                  Select cluster peers or enter your own peers
                </FormDescription>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Peers settings have been updated successfully.
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
