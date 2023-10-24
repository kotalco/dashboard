"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { ChainlinkNode } from "@/types";
import { Roles } from "@/enums";
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
import { Textarea } from "@/components/ui/textarea";

interface AccessControlTabProps {
  node: ChainlinkNode;
  role: Roles;
}

const schema = z.object({
  corsDomains: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your CORS domains or "*" to whitelist all domains`,
    }),
});

type Schema = z.input<typeof schema>;

export const AccessControlTab: React.FC<AccessControlTabProps> = ({
  node,
  role,
}) => {
  const { corsDomains } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      corsDomains: corsDomains.join("\n"),
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
      const { data } = await client.put<ChainlinkNode>(
        `/chainlink/nodes/${node.name}`,
        values
      );
      const { corsDomains } = data;
      reset({ corsDomains: corsDomains.join("\n") });
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
          name="corsDomains"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CORS Domains</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="max-w-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>One domain per line</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Access control settings have been updated successfully.
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
