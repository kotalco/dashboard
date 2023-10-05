"use client";

import * as z from "zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { client } from "@/lib/client-instance";
import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AlertModal } from "@/components/modals/alert-modal";

interface ValidatorTabProps {
  node: PolkadotNode;
  role: Roles;
}

export const ValidatorTab: React.FC<ValidatorTabProps> = ({ node, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { validator, pruning, rpc } = node;

  const schema = z
    .object({
      validator: z.boolean(),
      rpc: z.boolean().optional(),
    })
    .transform(({ validator }) => {
      if (validator && rpc) {
        return { validator, rpc: false };
      }
      return { validator };
    });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { validator },
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
    setValue,
  } = form;

  const confirmValidator = () => {
    setValue("validator", true, { shouldDirty: true });
    setIsOpen(false);
  };

  const onSubmit = async (values: Schema) => {
    try {
      const { data } = await client.put<PolkadotNode>(
        `/polkadot/nodes/${node.name}`,
        values
      );
      const { validator } = data;
      reset({ validator });
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
            name="validator"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-x-3">
                <FormLabel className="mt-2">Validator</FormLabel>
                <FormControl>
                  <Switch
                    disabled={isSubmitting || role === Roles.Reader || !pruning}
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (value && rpc) {
                        setIsOpen(true);
                        return;
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!pruning && (
            <Alert role="info">
              <AlertDescription>
                Node started with pruning disabled.
              </AlertDescription>
            </Alert>
          )}

          {isSubmitSuccessful && (
            <Alert variant="success" className="text-center">
              <AlertDescription>
                Validator settings have been updated successfully.
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
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Warning"
        description=" Activating validator will disable JSON-RPC Port. Are you sure you want
          to continue?"
        onConfirm={confirmValidator}
      />
    </>
  );
};
