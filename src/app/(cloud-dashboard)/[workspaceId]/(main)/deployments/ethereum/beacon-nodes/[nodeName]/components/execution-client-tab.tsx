"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BeaconNode, ExecutionClientNode, Secret } from "@/types";
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
import { SelectWithInput } from "@/components/form/select-with-input";

interface ExecutionClientTabProps {
  node: BeaconNode;
  executionClients: ExecutionClientNode[];
  role: Roles;
  secrets: Secret[];
}

const schema = z.object({
  executionEngineEndpoint: z
    .string({
      required_error: "Execution engine is required",
    })
    .min(1, "Execution engine is required")
    .trim(),
  jwtSecretName: z.string().min(1, "JWT secret is required"),
});

type Schema = z.infer<typeof schema>;

export const ExecutionClientTab: React.FC<ExecutionClientTabProps> = ({
  node,
  role,
  secrets,
  executionClients,
}) => {
  const params = useParams();
  const { executionEngineEndpoint, jwtSecretName } = node;
  const activeExecutionClients = executionClients
    .filter(({ engine }) => engine)
    .map(({ enginePort, name }) => ({
      label: name,
      value: `http://${name}:${enginePort}`,
    }));

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      executionEngineEndpoint,
      jwtSecretName,
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
      const { data } = await client.put<BeaconNode>(
        `/ethereum2/beaconnodes/${node.name}`,
        values
      );
      const { executionEngineEndpoint, jwtSecretName } = data;
      reset({
        executionEngineEndpoint,
        jwtSecretName,
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
        className="relative space-y-4"
      >
        <FormField
          control={form.control}
          name="executionEngineEndpoint"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Execution Engine Endpoint</FormLabel>
              <SelectWithInput
                placeholder="Select a Node"
                disabled={isSubmitting || role === Roles.Reader}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={activeExecutionClients}
                otherLabel="Use External Node"
              />
              <FormDescription>
                Nodes must have activated engine port
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jwtSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>JWT Secret</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting || role === Roles.Reader}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="jwt-secret"
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
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New JWT Secret
                    </Link>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Execution client settings have been updated successfully.
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
