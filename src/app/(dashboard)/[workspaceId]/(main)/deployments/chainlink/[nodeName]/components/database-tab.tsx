"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusCircle, PlusCircle } from "lucide-react";

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

interface DatabaseTabProps {
  node: ChainlinkNode;
  role: Roles;
}

const schema = z.object({
  databaseURL: z
    .string({ required_error: "Database connection URL is required" })
    .min(1, "Database connection URL is required")
    .trim()
    .refine((value) => /postgres:\/\//.test(value), {
      message: "Invalid database URL",
    }),
});

type Schema = z.infer<typeof schema>;

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ node, role }) => {
  const params = useParams();
  const { databaseURL } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { databaseURL },
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
      const { databaseURL } = data;
      reset({ databaseURL });
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
          name="databaseURL"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Database Connection URL</FormLabel>
              <FormControl>
                <Input
                  data-testid="database-url"
                  disabled={isSubmitting || role === Roles.Reader}
                  placeholder="postgres://"
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
              Database settings have been updated successfully.
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
