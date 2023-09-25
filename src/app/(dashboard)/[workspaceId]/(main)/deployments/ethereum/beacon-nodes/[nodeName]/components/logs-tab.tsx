"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode } from "@/types";
import { ExecutionClientLogging, Roles } from "@/enums";
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
import { Logs } from "@/components/logs";

interface LogsTabProps {
  node: ExecutionClientNode;
  role: Roles;
  token: string;
}

const schema = z.object({
  logging: z.nativeEnum(ExecutionClientLogging),
});

type Schema = z.infer<typeof schema>;

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const params = useParams();
  const { logging } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      logging,
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
      const { logging } = data;
      reset({
        logging,
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-8"
        >
          <FormField
            control={form.control}
            name="logging"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Verbosity Levels</FormLabel>
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="logging-mode"
                      className="bg-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getSelectItems(ExecutionClientLogging).map(
                      ({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Logs
            url={`ethereum/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${params.workspaceId}`}
          />

          {isSubmitSuccessful && (
            <Alert variant="success" className="text-center">
              <AlertDescription>
                Logging settings have been updated successfully.
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
    </>
  );
};
