"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, Secret } from "@/types";
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

interface NetWorkingTabProps {
  node: ExecutionClientNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  nodePrivateKeySecretName: z.string().optional().default(""),
  syncMode: z.nativeEnum(ExecutionClientSyncMode),
  staticNodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    ),
  bootnodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    ),
});

type Schema = z.input<typeof schema>;

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const params = useParams();
  const { nodePrivateKeySecretName, syncMode, staticNodes, bootnodes } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      nodePrivateKeySecretName,
      syncMode,
      staticNodes: staticNodes.join("\n"),
      bootnodes: bootnodes.join("\n"),
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
      const { data } = await client.put<ExecutionClientNode>(
        `/ethereum/nodes/${node.name}`,
        values
      );
      const { nodePrivateKeySecretName, syncMode, staticNodes, bootnodes } =
        data;
      reset({
        nodePrivateKeySecretName,
        syncMode,
        staticNodes: staticNodes.join("\n"),
        bootnodes: bootnodes.join("\n"),
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
        className="relative space-y-8"
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
                      className="max-w-xs bg-white"
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
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["Execution Client Private Key"]}`}
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
          name="syncMode"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Sync Mode</FormLabel>
              <Select
                disabled={isSubmitting || role === Roles.Reader}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="sync-mode" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSelectItems(ExecutionClientSyncMode).map(
                    ({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staticNodes"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Static Nodes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>One enodeURL per line</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bootnodes"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Boot Nodes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>One enodeURL per line</FormDescription>
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
