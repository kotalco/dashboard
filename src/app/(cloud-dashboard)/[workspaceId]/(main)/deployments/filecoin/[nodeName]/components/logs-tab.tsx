"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, FilecoinNode } from "@/types";
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
import { Switch } from "@/components/ui/switch";

interface LogsTabProps {
  node: FilecoinNode;
  role: Roles;
  token: string;
}

const schema = z.object({
  disableMetadataLog: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export const LogsTab: React.FC<LogsTabProps> = ({ node, role, token }) => {
  const params = useParams();
  const { disableMetadataLog } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      disableMetadataLog,
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
      const { data } = await client.put<FilecoinNode>(
        `/filecoin/nodes/${node.name}`,
        values
      );
      const { disableMetadataLog } = data;
      reset({
        disableMetadataLog,
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
          className="relative space-y-4"
        >
          <FormField
            control={form.control}
            name="disableMetadataLog"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-x-3">
                <FormLabel className="mt-2 text-base">
                  Disable Metadata Logs
                </FormLabel>
                <FormControl>
                  <Switch
                    disabled={isSubmitting || role === Roles.Reader}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Logs
            url={`filecoin/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${params.workspaceId}`}
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
