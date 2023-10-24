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
import Link from "next/link";

interface WalletTabProps {
  node: ChainlinkNode;
  role: Roles;
  passwords: Secret[];
}

const schema = z.object({
  keystorePasswordSecretName: z.string({
    required_error: "Keystore password is required",
  }),
});

type Schema = z.infer<typeof schema>;

export const WalletTab: React.FC<WalletTabProps> = ({
  node,
  role,
  passwords,
}) => {
  const params = useParams();
  const { keystorePasswordSecretName } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { keystorePasswordSecretName },
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
      const { keystorePasswordSecretName } = data;
      reset({ keystorePasswordSecretName });
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
          name="keystorePasswordSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Keystore password</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="keystore-password"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a password" />
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
              </div>
              <FormDescription>
                For securing access to chainlink wallet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Wallet settings have been updated successfully.
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
