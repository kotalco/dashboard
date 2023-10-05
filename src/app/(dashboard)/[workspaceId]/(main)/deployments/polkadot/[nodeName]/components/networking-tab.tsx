"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { NEARNode, PolkadotNode, Secret } from "@/types";
import { PolkadotSyncModes, Roles, SecretType } from "@/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getSelectItems } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface NetWorkingTabProps {
  node: PolkadotNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  nodePrivateKeySecretName: z.string().default(""),
  p2pPort: z.coerce
    .number({ invalid_type_error: "P2P Port is number" })
    .min(1, "P2P Port is between 1 and 65535")
    .max(65535, "P2P Port is between 1 and 65535")
    .default(30333),
  syncMode: z.nativeEnum(PolkadotSyncModes),
  retainedBlocks: z.coerce
    .number({ invalid_type_error: "Retained Blocks is number" })
    .min(1, "Retained Blocks is greater than 0")
    .default(256),
  pruning: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const params = useParams();
  const {
    nodePrivateKeySecretName,
    p2pPort,
    syncMode,
    retainedBlocks,
    pruning,
  } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      nodePrivateKeySecretName,
      p2pPort,
      syncMode,
      retainedBlocks,
      pruning,
    },
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
      const { data } = await client.put<PolkadotNode>(
        `/polkadot/nodes/${node.name}`,
        values
      );
      const {
        nodePrivateKeySecretName,
        p2pPort,
        syncMode,
        retainedBlocks,
        pruning,
      } = data;
      reset({
        nodePrivateKeySecretName,
        p2pPort,
        syncMode,
        retainedBlocks,
        pruning,
      });
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
          name="nodePrivateKeySecretName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Private Key</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="secret-private-key"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a Secret" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secrets.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["Polkadot Private Key"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Private Key
                    </Link>
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-transparent hover:text-destructive/70"
                    onClick={() => field.onChange("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="p2pPort"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>P2P Port</FormLabel>
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

        <FormField
          control={form.control}
          name="syncMode"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Sync Mode</FormLabel>
              <Select
                disabled={isSubmitting || role === Roles.Reader}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="network" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSelectItems(PolkadotSyncModes).map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pruning"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2">Pruning</FormLabel>
              <FormControl>
                <Switch
                  disabled
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="retainedBlocks"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Retained Blocks</FormLabel>
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
              Networking settings have been updated successfully.
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
