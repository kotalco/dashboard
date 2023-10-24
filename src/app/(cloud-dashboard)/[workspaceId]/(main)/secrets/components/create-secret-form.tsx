"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SecretType } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSelectItems } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { client } from "@/lib/client-instance";

const schema = z
  .object({
    name: z.string().min(1, "Secret name is required").trim(),
    type: z.nativeEnum(SecretType, {
      required_error: "Please select a type for your secret",
    }),
    workspace_id: z.string().min(1),
    data: z.record(
      z.enum([
        "password",
        "key",
        "keystore",
        "secret",
        "tls/key",
        "tls/crt",
        "tls.key",
        "tls.crt",
      ]),
      z.string().min(1, "This is required")
    ),
  })
  .transform((values) => {
    if (values.data["tls/crt"] && values.data["tls/key"]) {
      return {
        ...values,
        data: {
          "tls.crt": values.data["tls/crt"],
          "tls.key": values.data["tls/key"],
        },
      };
    }

    return values;
  });

type SchemaType = z.input<typeof schema>;

const defaultValues = {
  name: "",
  type: undefined,
  data: { password: "" },
};

export const CreateSecretForm = () => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const searchParams = useSearchParams();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldUnregister: true,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    setError,
    watch,
    reset,
  } = form;

  useEffect(() => {
    const type = searchParams.get("type") as SecretType | null;
    if (type) reset({ type });
  }, [reset, searchParams]);

  const type = watch("type");

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/core/secrets", values);
      router.push(`/${workspaceId}/secrets`);
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="change-email-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="workspace_id"
          defaultValue={workspaceId as string}
          render={({ field }) => <Input className="sr-only" {...field} />}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Name</FormLabel>
              <FormControl>
                <Input data-testid="name" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Secret Type</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="type" className="bg-white">
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSelectItems(SecretType).map(({ value, label }) => (
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

        {(type === SecretType.Password ||
          type === SecretType["Ethereum Keystore"]) && (
          <FormField
            control={form.control}
            name="data.password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    data-testid="password"
                    type="password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(type === SecretType["Execution Client Private Key"] ||
          type === SecretType["IPFS Cluster Peer Key"] ||
          type === SecretType["IPFS Swarm Key"] ||
          type === SecretType["Polkadot Private Key"] ||
          type === SecretType["NEAR Private Key"] ||
          type === SecretType["Stacks Private Key"]) && (
          <FormField
            control={form.control}
            name="data.key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(type === SecretType["IPFS Cluster Secret"] ||
          type === SecretType["JWT Secret"]) && (
          <FormField
            control={form.control}
            name="data.secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === SecretType["Ethereum Keystore"] && (
          <FormField
            control={form.control}
            name="data.keystore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keystore</FormLabel>
                <FormControl>
                  <FileInput
                    accept="application/json"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === SecretType["TLS Certificate"] && (
          <>
            <FormField
              control={form.control}
              name="data.tls/key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TLS Key</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.tls/crt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TLS Certificate</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button
          data-testid="submit"
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          type="submit"
        >
          Create
        </Button>

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
