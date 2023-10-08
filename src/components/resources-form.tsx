"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";

import { Roles, StorageUnits } from "@/enums";
import { ResourcesInfo } from "@/types";
import { client } from "@/lib/client-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputWithUnit } from "@/components/ui/input-with-unit";
import { TabsFooter } from "@/components/ui/tabs";
import { getSelectItems } from "@/lib/utils";

interface ResourcesFormProps<T> {
  node: T;
  updateUrl: string;
  role: Roles;
}

const schema = z.object({
  cpu: z
    .string()
    .min(1, "Please define CPU cores")
    .refine((value) => /^[1-9]\d*$/.test(value), {
      message: "CPU Cores must be a number",
    }),
  cpuLimit: z
    .string()
    .min(1, "Please define maximum CPU cores")
    .refine((value) => /^[1-9]\d*$/.test(value), {
      message: "CPU Cores must be a number",
    }),
  memory: z
    .string()
    .min(3, "Please define memory")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Memory must be a number",
    }),
  memoryLimit: z
    .string()
    .min(3, "Please define memory limit")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Memory limit must be a number",
    }),
  storage: z
    .string()
    .min(3, "Please define storage")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Storage must be a number",
    }),
});

type Schema = z.infer<typeof schema>;

export function ResourcesForm<T extends ResourcesInfo>({
  node,
  updateUrl,
  role,
}: ResourcesFormProps<T>) {
  const { cpu, cpuLimit, memory, memoryLimit, storage } = node;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { cpu, cpuLimit, memory, memoryLimit, storage },
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
      await client.put(updateUrl, values);
      reset({ ...values });
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
        <div className="max-w-sm space-y-4">
          <FormField
            control={form.control}
            name="cpu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPU Cores Required</FormLabel>
                <FormControl>
                  <InputWithUnit
                    disabled={isSubmitting || role === Roles.Reader}
                    unit={`Core${+field.value !== 1 ? "s" : ""}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpuLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum CPU Cores</FormLabel>
                <FormControl>
                  <InputWithUnit
                    disabled={isSubmitting || role === Roles.Reader}
                    unit={`Core${+field.value !== 1 ? "s" : ""}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Required</FormLabel>
                <FormControl>
                  <InputWithUnit
                    disabled={isSubmitting || role === Roles.Reader}
                    unit={getSelectItems(StorageUnits)}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memoryLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MAX Memory</FormLabel>
                <FormControl>
                  <InputWithUnit
                    disabled={isSubmitting || role === Roles.Reader}
                    unit={getSelectItems(StorageUnits)}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disk Space Required</FormLabel>
                <FormControl>
                  <InputWithUnit
                    disabled={isSubmitting || role === Roles.Reader}
                    unit={getSelectItems(StorageUnits)}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isSubmitSuccessful && (
          <Alert variant="success" className="text-center">
            <AlertDescription>
              Resources settings have been updated successfully.
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
}
