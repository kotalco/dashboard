"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { Secret, ValidatorNode } from "@/types";
import { Roles, SecretType, ValidatorClients } from "@/enums";
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
import { MultiSelect } from "@/components/ui/multi-select";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KeystoreTabProps {
  node: ValidatorNode;
  role: Roles;
  keystores: Secret[];
  passwords: Secret[];
}

export const KeystoreTab: React.FC<KeystoreTabProps> = ({
  node,
  role,
  keystores,
  passwords,
}) => {
  const params = useParams();

  const schema = z.object({
    keystores: z
      .string({ required_error: "Keystores are required" })
      .array()
      .nonempty({ message: "Keystores are required" })
      .transform((val) => val.map((secret) => ({ secretName: secret }))),
    walletPasswordSecretName: z
      .string()
      .optional()
      .default("")
      .refine(
        (value) =>
          (node.client === ValidatorClients["Prysatic Labs Prysm"] &&
            !!value) ||
          node.client !== ValidatorClients["Prysatic Labs Prysm"],
        {
          message: "Wallet Password is required for Prysm Client",
          path: ["walletPasswordSecretName"],
        }
      ),
  });

  type Schema = z.input<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      keystores: node.keystores.map(({ secretName }) => secretName),
      walletPasswordSecretName: node.walletPasswordSecretName,
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
      const { data } = await client.put<ValidatorNode>(
        `/ethereum2/validators/${node.name}`,
        values
      );
      const { keystores, walletPasswordSecretName } = data;
      reset({
        keystores: keystores.map(({ secretName }) => secretName),
        walletPasswordSecretName,
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
          name="keystores"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Ethereum Keystores</FormLabel>
              <div>
                <MultiSelect
                  disabled={isSubmitting || role === Roles.Reader}
                  defaultValue={field.value}
                  value={field.value}
                  placeholder="Select keystores"
                  options={keystores.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  onChange={field.onChange}
                  emptyText="No Keystores Available"
                />
                {role !== Roles.Reader && (
                  <FormDescription>
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["Ethereum Keystore"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Keystore
                    </Link>
                  </FormDescription>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {node.client === ValidatorClients["Prysatic Labs Prysm"] && (
          <FormField
            control={form.control}
            name="walletPasswordSecretName"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Prysm Client Wallet Password</FormLabel>
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="client" className="bg-white">
                      <SelectValue placeholder="Select a Password" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {passwords.map(({ name }) => (
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
        )}

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Keystore settings has been updated successfully.
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
