"use client";

import { useEffect } from "react";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BitcoinNetworks,
  ExecutionClientClients,
  ExecutionClientNetworks,
} from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getEnumKey, getLatestVersion, getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Clients } from "@/types";
import { SelectWithInput } from "@/components/ui/select-with-input";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  client: z.nativeEnum(ExecutionClientClients, {
    required_error: "Please select a Client",
  }),
  network: z.string().min(1, "Please select a Netwrok").trim(),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});

type SchemaType = z.infer<typeof schema>;

const defaultValues = {
  name: "",
  network: undefined,
  client: undefined,
};

export const CreateExecutionClientNodeForm: React.FC<{ images: Clients }> = ({
  images,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    watch,
    setError,
    setValue,
  } = form;

  const [watchedClient, network] = watch(["client", "network"]);

  useEffect(() => {
    if (watchedClient)
      setValue("image", getLatestVersion(images, watchedClient), {
        shouldValidate: true,
      });
  }, [watchedClient, images, setValue]);

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/ethereum/nodes", values);
      router.push(`/${workspaceId}/deployments/ethereum`);
      router.refresh();
      toast({
        title: "Execution client node has been created",
        description: `${values.name} node has been created successfully, and will be up and running in few seconds.`,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (response?.status === 400) {
          setError("root", {
            type: response?.status.toString(),
            message: "Name already exists.",
          });
          return;
        }

        if (response?.status === 403) {
          setError("root", {
            type: response?.status.toString(),
            message: "Reached Nodes Limit.",
          });
          return;
        }

        setError("root", {
          type: response?.status.toString(),
          message: "Something went wrong.",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="create-node"
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="workspace_id"
          defaultValue={workspaceId as string}
          render={({ field }) => <Input className="sr-only" {...field} />}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Name</FormLabel>
              <FormControl>
                <Input data-testid="name" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Client</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="client" className="bg-white">
                    <SelectValue placeholder="Select a Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSelectItems(ExecutionClientClients).map(
                    ({ value, label }) => (
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

        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Network</FormLabel>
              <SelectWithInput
                placeholder="Select a Network"
                disabled={isSubmitting}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={getSelectItems(ExecutionClientNetworks)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          data-testid="submit"
          disabled={(isSubmitted && !isValid) || isSubmitting || !isDirty}
          type="submit"
        >
          Create
        </Button>

        {errors.root && (
          <Alert variant="destructive" className="text-center">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
