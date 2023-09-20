"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircle, PlusCircle } from "lucide-react";

import { client } from "@/lib/client-instance";
import { BitcoinNode, Secret } from "@/types";
import { Roles, SecretType } from "@/enums";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface APITabProps {
  node: BitcoinNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  rpc: z.boolean(),
  txIndex: z.boolean(),
  rpcUsers: z
    .object({
      username: z.string().min(1, "Username is required"),
      passwordSecretName: z.string().min(1, "Please select a password"),
    })
    .array()
    .nonempty(),
});

type Schema = z.infer<typeof schema>;

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const params = useParams();
  const { rpc, txIndex, rpcUsers } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { rpc, txIndex, rpcUsers },
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
    control,
    reset,
    setError,
  } = form;

  const { fields, append, remove } = useFieldArray<Schema>({
    control,
    name: "rpcUsers",
  });

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<BitcoinNode>(
        `/bitcoin/nodes/${node.name}`,
        values
      );
      const { rpc, txIndex, rpcUsers } = data;
      reset({ rpc, txIndex, rpcUsers });
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
          name="rpc"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">JSON-RPC Server</FormLabel>
              <FormControl>
                <Switch
                  disabled={role === Roles.Reader}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="txIndex"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">
                Transaction Index
              </FormLabel>
              <FormControl>
                <Switch
                  disabled={role === Roles.Reader}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-base">RPC Users</FormLabel>
          {fields.map(({ id }, idx) => (
            <div key={id} className="grid grid-cols-12 gap-x-4">
              <FormField
                control={form.control}
                name={`rpcUsers.${idx}.username`}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-5 xl:col-span-4">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`rpcUsers.${idx}.passwordSecretName`}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-5 xl:col-span-4">
                    <FormLabel>Password</FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          data-testid="passwordSecretName"
                          className="bg-white"
                        >
                          <SelectValue placeholder="Select a Password" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {secrets.map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                        <Link
                          href={`/${params.workspaceId}/secrets/new?type=${SecretType.Password}`}
                          className="text-sm text-primary hover:underline underline-offset-4"
                        >
                          Create New Password
                        </Link>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {idx === fields.length - 1 && (
                <div className="col-span-2 mt-8">
                  {fields.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(-1)}
                    >
                      <MinusCircle className="text-gray-400 hover:text-gray-500 w-7 h-7" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      append({ username: "", passwordSecretName: "" })
                    }
                  >
                    <PlusCircle className="text-gray-400 hover:text-gray-500 w-7 h-7" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

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
