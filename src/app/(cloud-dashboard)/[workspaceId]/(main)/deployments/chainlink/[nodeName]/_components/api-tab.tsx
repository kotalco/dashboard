"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BitcoinNode, ChainlinkNode, Secret } from "@/types";
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
  node: ChainlinkNode;
  role: Roles;
  secrets: { label: string; value: string }[];
}

const schema = z.object({
  api: z.boolean(),
  apiCredentials: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email")
      .trim(),
    passwordSecretName: z.string({ required_error: "Password is required" }),
  }),
});

type Schema = z.infer<typeof schema>;

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const params = useParams();
  const { api, apiCredentials } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { api, apiCredentials },
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
      const { data } = await client.put<ChainlinkNode>(
        `/chainlink/nodes/${node.name}`,
        values
      );
      const { api, apiCredentials } = data;
      reset({ api, apiCredentials });
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
          name="api"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">API</FormLabel>
              <FormControl>
                <Switch
                  disabled={role === Roles.Reader || isSubmitting}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiCredentials.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-testid="email"
                  className="max-w-sm"
                  disabled={isSubmitting || role === Roles.Reader}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="apiCredentials.passwordSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Password</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="password"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a password" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secrets.map(({ label, value }) => (
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
              </div>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
