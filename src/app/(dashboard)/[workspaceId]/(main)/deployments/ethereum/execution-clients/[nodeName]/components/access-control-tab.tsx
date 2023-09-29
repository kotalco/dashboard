"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { ExecutionClientNode } from "@/types";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

interface AccessControlTabProps {
  node: ExecutionClientNode;
  role: Roles;
}

const schema = z.object({
  hosts: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your whitelisted hosts or "*" to whitelist all hosts`,
    }),
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
  const { hosts, corsDomains } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      hosts: hosts.join("\n"),
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
      const { data } = await client.put<ExecutionClientNode>(
        `/ethereum/nodes/${node.name}`,
        values
      );
      const { hosts, corsDomains } = data;
      reset({ hosts: hosts.join("\n"), corsDomains: corsDomains.join("\n") });
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
          name="hosts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Whitelisted Hosts
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-3 h-3 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>Server Enforced</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="max-w-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                * (asterisk) means trust all hosts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="corsDomains"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                CORS Domains
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="w-3 h-3 ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>Browser Enforced</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || role === Roles.Reader}
                  className="max-w-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                * (asterisk) means trust all domains{" "}
              </FormDescription>
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
