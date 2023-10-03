"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, NEARNode, Secret } from "@/types";
import { ExecutionClientSyncMode, Roles, SecretType } from "@/enums";
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

interface NetWorkingTabProps {
  node: NEARNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  nodePrivateKeySecretName: z.string().optional().default(""),
  minPeers: z.coerce
    .number({ invalid_type_error: "Minimum Peers is number" })
    .min(1, "Minimum Peers is greater than 0")
    .optional()
    .default(5),
  p2pPort: z.coerce
    .number({ invalid_type_error: "P2P Port is number" })
    .min(1, "P2P Port is between 1 and 65535")
    .max(65535, "P2P Port is between 1 and 65535")
    .optional()
    .default(24567),
  bootnodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .optional(),
});

type Schema = z.input<typeof schema>;

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const params = useParams();
  const { nodePrivateKeySecretName, minPeers, p2pPort, bootnodes } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      nodePrivateKeySecretName,
      minPeers,
      p2pPort,
      bootnodes: bootnodes?.join("\n"),
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
      const { data } = await client.put<NEARNode>(
        `/near/nodes/${node.name}`,
        values
      );
      const { nodePrivateKeySecretName, minPeers, p2pPort, bootnodes } = data;
      reset({
        nodePrivateKeySecretName,
        minPeers,
        p2pPort,
        bootnodes: bootnodes?.join("\n"),
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
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["NEAR Private Key"]}`}
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
          name="minPeers"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Minimum Peers</FormLabel>
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
          name="bootnodes"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Boot Nodes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>One node URL per line</FormDescription>
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
