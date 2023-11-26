"use client";

import Link from "next/link";
import * as z from "zod";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getLatestVersion, getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { BeaconNode, Clients, Secret } from "@/types";
import {
  BeaconNodeClients,
  SecretType,
  ValidatorClients,
  ValidatorNetworks,
} from "@/enums";
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
import { SelectWithInput } from "@/components/form/select-with-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MultiSelect } from "@/components/ui/multi-select";

interface CreateValidatorNodeFormProps {
  images: Clients;
  beaconNodes: BeaconNode[];
  passwords: Secret[];
  keystores: Secret[];
}

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Node name is required")
      .max(64, "Too long name")
      .trim()
      .refine((value) => /^\S*$/.test(value), {
        message: "Invalid character used",
      }),
    client: z.nativeEnum(ValidatorClients, {
      required_error: "Client is required",
    }),
    network: z
      .string({ required_error: "Network is required" })
      .min(1, "Network is required")
      .trim(),
    keystores: z
      .string({ required_error: "Keystores are required" })
      .array()
      .nonempty({ message: "Keystores are required" })
      .transform((val) => val.map((secret) => ({ secretName: secret }))),
    walletPasswordSecretName: z.string().optional(),
    beaconEndpoints: z
      .string({ required_error: "Beacon node endpoints are required" })
      .array()
      .nonempty({ message: "Beacon node endpoints are required" }),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .refine(
    ({ client, walletPasswordSecretName }) =>
      (client === ValidatorClients["Prysatic Labs Prysm"] &&
        !!walletPasswordSecretName) ||
      client !== ValidatorClients["Prysatic Labs Prysm"],
    {
      message: "Wallet Password is required for Prysm Client",
      path: ["walletPasswordSecretName"],
    }
  )
  .refine(
    ({ client, beaconEndpoints }) =>
      (client !== ValidatorClients["Sigma Prime Lighthouse"] &&
        beaconEndpoints.length === 1) ||
      client === ValidatorClients["Sigma Prime Lighthouse"],
    {
      message: "Beacon node endpoint requires only 1 endpoint",
      path: ["beaconEndpoints"],
    }
  );

type SchemaType = z.input<typeof schema>;

const defaultValues = {
  name: "",
};

export const CreateValidatorNodeForm: React.FC<
  CreateValidatorNodeFormProps
> = ({ images, beaconNodes, passwords, keystores }) => {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();
  const activeBeaconNods = beaconNodes
    .filter(({ client, rest, rpc }) =>
      client === BeaconNodeClients["ConsenSys Teku"] ||
      client === BeaconNodeClients["Sigma Prime Lighthouse"]
        ? rest
        : rpc
    )
    .map(({ name, client, rpcPort, restPort }) => ({
      label: name,
      value: `http://${name}:${
        client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"]
          ? restPort
          : rpcPort
      }`,
    }));

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    shouldUnregister: true,
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

  async function onSubmit(values: SchemaType) {
    try {
      await client.post("/ethereum2/validators", values);
      router.push(`/${workspaceId}/deployments/ethereum?deployment=validators`);
      router.refresh();
      toast({
        title: "Validator node has been created",
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
                  {getSelectItems(ValidatorClients).map(({ value, label }) => (
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
                options={getSelectItems(ValidatorNetworks)}
                otherLabel="Other Network"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keystores"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Ethereum Keystores</FormLabel>
              <div>
                <MultiSelect
                  value={field.value}
                  placeholder="Select keystores"
                  options={keystores.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  onChange={field.onChange}
                  emptyText="No Keystores Available"
                />
                <FormDescription>
                  <Link
                    href={`/${params.workspaceId}/secrets/new?type=${SecretType["Ethereum Keystore"]}`}
                    className="text-sm text-primary hover:underline underline-offset-4"
                  >
                    Create New Keystore
                  </Link>
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedClient === ValidatorClients["Prysatic Labs Prysm"] && (
          <FormField
            control={form.control}
            name="walletPasswordSecretName"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
                <FormLabel>Prysm Client Wallet Password</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="client" className="bg-white">
                      <SelectValue placeholder="Select a Password" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {passwords.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType.Password}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Password
                    </Link>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="beaconEndpoints"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Beacon Node Endpoints</FormLabel>
              <div>
                <MultiSelect
                  value={field.value}
                  placeholder="Select beacon nodes or enter your own endpoints"
                  options={activeBeaconNods}
                  onChange={field.onChange}
                  emptyText="Enter your own endpoints"
                  allowCustomValues
                />
              </div>
              <FormDescription>
                Select beacon nodes or enter your own endpoints
              </FormDescription>
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
