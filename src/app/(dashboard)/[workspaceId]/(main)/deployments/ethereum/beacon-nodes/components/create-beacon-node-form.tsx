"use client";

import Link from "next/link";
import * as z from "zod";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLatestVersion, getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Clients, ExecutionClientNode, Secret } from "@/types";
import { BeaconNodeClients, BeaconNodeNetworks, SecretType } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SelectWithInput } from "@/components/ui/select-with-input";

interface CreateBeaconNodeFormProps {
  images: Clients;
  executionClients: ExecutionClientNode[];
  secrets: Secret[];
}

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  client: z.nativeEnum(BeaconNodeClients, {
    required_error: "Client is required",
  }),
  network: z
    .string({ required_error: "Network is required" })
    .min(1, "Network is required")
    .trim(),
  executionEngineEndpoint: z
    .string({
      required_error: "Execution engine is required",
    })
    .min(1, "Execution engine is required")
    .trim(),
  jwtSecretName: z.string().min(1, "JWT secret is required"),
  checkpointSyncUrl: z.string().default(""),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});

type SchemaType = z.infer<typeof schema>;

const defaultValues = {
  name: "",
  checkpointSyncUrl: "",
};

export const CreateBeaconNodeForm: React.FC<CreateBeaconNodeFormProps> = ({
  images,
  executionClients,
  secrets,
}) => {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();
  const activeExecutionClients = executionClients
    .filter(({ engine }) => engine)
    .map(({ enginePort, name }) => ({
      label: name,
      value: `http://${name}:${enginePort}`,
    }));

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

  const [watchedClient] = watch(["client"]);

  useEffect(() => {
    if (watchedClient)
      setValue("image", getLatestVersion(images, watchedClient), {
        shouldValidate: true,
      });
  }, [watchedClient, images, setValue]);

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await client.post("/ethereum2/beaconnodes", values);
      router.push(
        `/${workspaceId}/deployments/ethereum?deployment=beacon-nodes`
      );
      router.refresh();
      toast({
        title: "Beacon node has been created",
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
                  {getSelectItems(BeaconNodeClients).map(({ value, label }) => (
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
                options={getSelectItems(BeaconNodeNetworks)}
                otherLabel="Other Network"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="executionEngineEndpoint"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Execution Engine Endpoint</FormLabel>
              <SelectWithInput
                placeholder="Select a Node"
                disabled={isSubmitting}
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
          name="checkpointSyncUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Checkpoint Sync URL <strong>(Optional)</strong>
              </FormLabel>
              <FormControl>
                <Input
                  data-testid="sync-url"
                  disabled={isSubmitting}
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

        <FormField
          control={form.control}
          name="jwtSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>JWT Secret</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="jwt-secret"
                      className="max-w-xs bg-white"
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
