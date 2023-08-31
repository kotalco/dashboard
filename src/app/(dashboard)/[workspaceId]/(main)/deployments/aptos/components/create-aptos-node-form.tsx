"use client";

import * as z from "zod";
import { useEffect } from "react";
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
import { AptosNetworks } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getLatestVersion, getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Clients } from "@/types";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(AptosNetworks, {
    required_error: "Please select a Network",
  }),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});

type SchemaType = z.infer<typeof schema>;

const defaultValues = {
  name: "",
  network: undefined,
};

export const CreateAptosNodeForm: React.FC<{ images: Clients }> = ({
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

  const [network] = watch(["network"]);

  useEffect(() => {
    if (network)
      setValue("image", getLatestVersion(images, "aptos-core", network), {
        shouldValidate: true,
      });
  }, [images, network, setValue]);

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/aptos/nodes", values);
      router.push(`/${workspaceId}/deployments/aptos`);
      router.refresh();
      toast({
        title: "Aptos node has been created",
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
          name="network"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Network</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="network" className="bg-white">
                    <SelectValue placeholder="Select a Network" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getSelectItems(AptosNetworks).map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm">
          Client:{" "}
          <a
            href="https://github.com/aptos-labs/aptos-core"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            aptos-core
          </a>
        </p>

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
