"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { Secret, StacksNode } from "@/types";
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

interface NetWorkingTabProps {
  node: StacksNode;
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  nodePrivateKeySecretName: z.string().default(""),
});

type Schema = z.infer<typeof schema>;

export const NetworkingTab: React.FC<NetWorkingTabProps> = ({
  node,
  role,
  secrets,
}) => {
  const params = useParams();
  const { nodePrivateKeySecretName } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { nodePrivateKeySecretName },
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
      const { data } = await client.put<StacksNode>(
        `/stacks/nodes/${node.name}`,
        values
      );
      const { nodePrivateKeySecretName } = data;
      reset({ nodePrivateKeySecretName });
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
          name="nodePrivateKeySecretName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Private Key</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="secret-private-key"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a Secret" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secrets.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["Stacks Private Key"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Private Key
                    </Link>
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-transparent hover:text-destructive/70"
                    onClick={() => field.onChange("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Networking settings have been updated successfully.
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
