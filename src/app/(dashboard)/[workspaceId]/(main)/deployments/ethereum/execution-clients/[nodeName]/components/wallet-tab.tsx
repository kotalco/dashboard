"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BitcoinNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";

interface WalletTabProps {
  node: BitcoinNode;
  role: Roles;
}

const schema = z.object({
  wallet: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export const WalletTab: React.FC<WalletTabProps> = ({ node, role }) => {
  const { wallet } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { wallet },
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
      const { data } = await client.put<BitcoinNode>(
        `/bitcoin/nodes/${node.name}`,
        values
      );
      reset({ wallet: data.wallet });
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
          name="wallet"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-x-3">
              <FormLabel className="mt-2 text-base">Wallet</FormLabel>
              <FormControl>
                <Switch
                  disabled={role === Roles.Reader}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Load wallet and enable wallet RPC calls
              </FormDescription>
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
