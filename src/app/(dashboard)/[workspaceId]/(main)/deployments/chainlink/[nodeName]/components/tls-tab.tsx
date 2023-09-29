"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";

import { client } from "@/lib/client-instance";
import { ChainlinkNode, Secret } from "@/types";
import { Roles, SecretType } from "@/enums";
import {
  Form,
  FormControl,
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
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface TLSTabProps {
  node: ChainlinkNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z
  .object({
    certSecretName: z.string().optional(),
    tlsPort: z.coerce.number().optional(),
    secureCookies: z.boolean(),
  })
  .transform((values) =>
    values.certSecretName
      ? values
      : { certSecretName: "", secureCookies: false }
  );

type Schema = z.infer<typeof schema>;

export const TLSTab: React.FC<TLSTabProps> = ({ node, role, secrets }) => {
  const params = useParams();
  const { certSecretName, tlsPort, secureCookies } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { certSecretName, tlsPort, secureCookies },
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
    setValue,
  } = form;
  const certificate = watch("certSecretName");

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<ChainlinkNode>(
        `/chainlink/nodes/${node.name}`,
        values
      );
      const { certSecretName, tlsPort, secureCookies } = data;
      reset({ certSecretName, tlsPort, secureCookies });
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
          name="certSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Certificate</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="certificate"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a password" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secrets.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["TLS Certificate"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Certificate
                    </Link>
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-transparent hover:text-destructive/70"
                    onClick={() => {
                      field.onChange("");
                      setValue("secureCookies", false);
                    }}
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
          name="secureCookies"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center gap-x-3">
                <FormLabel className="text-base">Secure Cookies</FormLabel>
                <FormControl>
                  <Switch
                    disabled={
                      role === Roles.Reader || isSubmitting || !certificate
                    }
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tlsPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TLS Port</FormLabel>
              <FormControl>
                <Input
                  data-testid="tls-port"
                  className="max-w-sm"
                  disabled={
                    isSubmitting || role === Roles.Reader || !certificate
                  }
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
              TLS settings have been updated successfully.
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
