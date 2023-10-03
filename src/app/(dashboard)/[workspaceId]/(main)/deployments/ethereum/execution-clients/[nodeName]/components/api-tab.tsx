"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { ExecutionClientNode, Secret } from "@/types";
import {
  ExecutionClientAPI,
  ExecutionClientClients,
  Roles,
  SecretType,
} from "@/enums";
import { getSelectItems } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";

interface APITabProps {
  node: ExecutionClientNode;
  role: Roles;
  secrets: Secret[];
}

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const params = useParams();
  const { engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql } = node;

  const schema = z
    .object({
      engine: z.boolean(),
      jwtSecretName: z.string().optional(),
      rpc: z.boolean(),
      rpcAPI: z.array(z.string()).default([]).optional(),
      ws: z.boolean(),
      wsAPI: z.array(z.string()).default([]).optional(),
      graphql: z.boolean().optional(),
    })
    .refine(
      ({ engine, jwtSecretName }) => (engine && jwtSecretName) || !engine,
      {
        message: "Please select a JWT secret.",
        path: ["jwtSecretName"],
      }
    )
    .refine(
      ({ rpc, graphql }) =>
        node.client === ExecutionClientClients["Go Ethereum"] && graphql
          ? rpc
          : typeof rpc === "boolean",
      {
        message:
          "JSON-RPC Server should be activated with GraphQl Server if client is Go Ethereum",
        path: ["rpc"],
      }
    )
    .refine(({ rpc, rpcAPI }) => (rpc ? rpcAPI?.some((api) => api) : !rpcAPI), {
      message: "Select at least 1 API",
      path: ["rpcAPI"],
    })
    .refine(({ ws, wsAPI }) => (ws ? wsAPI?.some((api) => api) : !wsAPI), {
      message: "Select at least 1 API",
      path: ["wsAPI"],
    });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql },
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
    watch,
  } = form;

  const [watchedEngine, watchedRpc, watchedWs] = watch(["engine", "rpc", "ws"]);

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<ExecutionClientNode>(
        `/ethereum/nodes/${node.name}`,
        values
      );
      const { engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql } = data;
      reset({ engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql });
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
        <div className="p-4 border rounded-lg">
          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between gap-x-3">
                  <FormLabel className="text-base">
                    Execution Engine RPC
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

          {watchedEngine && (
            <FormField
              control={form.control}
              name="jwtSecretName"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>JWT Secret</FormLabel>
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
                          href={`/${params.workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`}
                          className="text-sm text-primary hover:underline underline-offset-4"
                        >
                          Create New JWT Secret
                        </Link>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <FormField
            control={form.control}
            name="rpc"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between gap-x-3">
                  <FormLabel className="text-base">JSON-RPC Server</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isSubmitting || role === Roles.Reader}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedRpc && (
            <FormField
              control={form.control}
              name="rpcAPI"
              render={() => (
                <FormItem>
                  <div className="mt-4">
                    <FormDescription>
                      Select which APIs you want to use
                    </FormDescription>
                  </div>
                  <div className="flex space-x-10">
                    {getSelectItems(ExecutionClientAPI).map(
                      ({ value, label }) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="rpcAPI"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={value}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange(
                                            field.value
                                              ? [...field.value, value]
                                              : [value]
                                          )
                                        : field.onChange(
                                            field.value?.filter(
                                              (item) => item !== value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <FormField
            control={form.control}
            name="ws"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between gap-x-3">
                  <FormLabel className="text-base">Web Socket Server</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isSubmitting || role === Roles.Reader}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedWs && (
            <FormField
              control={form.control}
              name="wsAPI"
              render={() => (
                <FormItem>
                  <div className="mt-4">
                    <FormDescription>
                      Select which APIs you want to use
                    </FormDescription>
                  </div>
                  <div className="flex space-x-10">
                    {getSelectItems(ExecutionClientAPI).map(
                      ({ value, label }) => (
                        <FormField
                          key={value}
                          control={form.control}
                          name="wsAPI"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={value}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange(
                                            field.value
                                              ? [...field.value, value]
                                              : [value]
                                          )
                                        : field.onChange(
                                            field.value?.filter(
                                              (item) => item !== value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {node.client !== ExecutionClientClients.Nethermind && (
          <div className="p-4 border rounded-lg">
            <FormField
              control={form.control}
              name="graphql"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between gap-x-3">
                    <FormLabel className="text-base">GraphQl Server</FormLabel>
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
          </div>
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
