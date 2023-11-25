"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { AptosNode, FilecoinNode, IPFSPeer } from "@/types";
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
import { SelectWithInput } from "@/components/ui/select-with-input";

interface IPFSTabProps {
  node: FilecoinNode;
  role: Roles;
  peers: IPFSPeer[];
}

const schema = z.object({
  ipfsForRetrieval: z.boolean(),
  ipfsOnlineMode: z.boolean(),
  ipfsPeerEndpoint: z.string().trim().optional(),
});

type Schema = z.input<typeof schema>;

export const IPFSTab: React.FC<IPFSTabProps> = ({ node, role, peers }) => {
  const { ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint } = node;
  const peersOptions = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint },
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
      const { data } = await client.put<FilecoinNode>(
        `/filecoin/nodes/${node.name}`,
        values
      );
      const { ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint } = data;
      reset({ ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint });
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
          name="ipfsForRetrieval"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">
                Use IPFS For Retrieval
              </FormLabel>
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
          name="ipfsOnlineMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">IPFS Online Mode</FormLabel>
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
          name="ipfsPeerEndpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPFS Peer Endpoint</FormLabel>
              <SelectWithInput
                placeholder="Select a peer"
                disabled={isSubmitting || role === Roles.Reader}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={peersOptions}
                otherLabel="Use External Peer"
                allowClear
              />

              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              IPFS settings have been updated successfully.
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
