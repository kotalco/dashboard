"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { client } from "@/lib/client-instance";
import { BeaconNode } from "@/types";
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
import { Input } from "@/components/ui/input";

interface CheckpointSyncTabProps {
  node: BeaconNode;
  role: Roles;
}

const schema = z.object({
  checkpointSyncUrl: z.string().default(""),
});

type Schema = z.infer<typeof schema>;

export const CheckpointSyncTab: React.FC<CheckpointSyncTabProps> = ({
  node,
  role,
}) => {
  const params = useParams();
  const { checkpointSyncUrl } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      checkpointSyncUrl,
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
      const { checkpointSyncUrl } = data;
      reset({
        checkpointSyncUrl,
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
          name="checkpointSyncUrl"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel>Checkpoint Sync URL</FormLabel>
              <FormControl>
                <Input
                  data-testid="sync-url"
                  disabled={isSubmitting || role === Roles.Reader}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Checkpoint sync endpoints available{" "}
                <a
                  className="text-primary hover:underline underline-offset-2"
                  rel="noreferrer"
                  href="https://eth-clients.github.io/checkpoint-sync-endpoints/"
                  target="_blank"
                >
                  here
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Checkpoint Sync URL has been updated successfully.
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
