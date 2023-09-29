"use client";

import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BitcoinNetworks, ChainlinkNetworks, SecretType } from "@/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { ExecutionClientNode, Secret, Version } from "@/types";
import { SelectWithInput } from "@/components/ui/select-with-input";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";

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
    evmChain: z.nativeEnum(ChainlinkNetworks, {
      required_error: "EVM Chain is required",
    }),
    ethereumWsEndpoint: z
      .string({ required_error: "Ethereum websocket is required" })
      .min(1, "Ethereum websocket is required")
      .trim()
      .refine((value) => /wss?:\/\//.test(value), {
        message: "Invalid websocket URL",
      }),
    databaseURL: z
      .string({ required_error: "Database connection URL is required" })
      .min(1, "Database connection URL is required")
      .trim()
      .refine((value) => /postgres:\/\//.test(value), {
        message: "Invalid database URL",
      }),
    keystorePasswordSecretName: z.string({
      required_error: "Keystore password is required",
    }),
    apiCredentials: z.object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid Email")
        .trim(),
      passwordSecretName: z.string({ required_error: "Password is required" }),
    }),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .transform(({ evmChain, ...values }) => {
    const [id, address] = evmChain.split(":");
    return {
      ...values,
      ethereumChainId: parseInt(id, 10),
      linkContractAddress: address,
    };
  });

type Schema = z.input<typeof schema>;

interface CreateChainlinkNodeFormProps {
  images: Version[];
  executionClients: ExecutionClientNode[];
  passwords: Secret[];
}

export const CreateChainlinkNodeForm: React.FC<
  CreateChainlinkNodeFormProps
> = ({ images, executionClients, passwords }) => {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();
  const activeExecutionClients = executionClients
    .filter(({ ws }) => ws)
    .map(({ name, wsPort }) => ({
      label: name,
      value: `ws://${name}:${wsPort}`,
    }));

  const defaultValues = {
    name: "",
    image: images[0].image,
    databaseURL: "",
    apiCredentials: { email: "" },
  };
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    setError,
  } = form;

  async function onSubmit(values: Schema) {
    try {
      await client.post("/chainlink/nodes", values);
      router.push(`/${workspaceId}/deployments/chainlink`);
      router.refresh();
      toast({
        title: "Chainlink node has been created",
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
          name="evmChain"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>EVM Chain</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="network" className="bg-white">
                    <SelectValue placeholder="Select an Chain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {getSelectItems(ChainlinkNetworks).map(({ value, label }) => (
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
            href="https://github.com/smartcontractkit/chainlink"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            Chainlink
          </a>
        </p>

        <FormField
          control={form.control}
          name="ethereumWsEndpoint"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Ethereum Websocket Endpoint</FormLabel>
              <SelectWithInput
                placeholder="Select a Execution Client"
                disabled={isSubmitting}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={activeExecutionClients}
                otherLabel="Externally Managed Node"
              />
              <FormDescription>
                Execution client nodes with WebSocket enabled
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="databaseURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Connection URL</FormLabel>
              <FormControl>
                <Input
                  data-testid="name"
                  disabled={isSubmitting}
                  placeholder="postgres://"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keystorePasswordSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Keystore password</FormLabel>
              <div className="flex items-center gap-x-2">
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      data-testid="keystore-password"
                      className="max-w-sm bg-white"
                    >
                      <SelectValue placeholder="Select a password" />
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
              </div>
              <FormDescription>
                For securing access to chainlink wallet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <Label className="text-xl">API Credentials</Label>
            <p className="text-sm text-muted-foreground">
              For securing access to chainlink dashboard
            </p>
          </div>

          <FormField
            control={form.control}
            name="apiCredentials.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    data-testid="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiCredentials.passwordSecretName"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Password</FormLabel>
                <div className="flex items-center gap-x-2">
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        data-testid="keystore-password"
                        className="max-w-sm bg-white"
                      >
                        <SelectValue placeholder="Select a password" />
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
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
