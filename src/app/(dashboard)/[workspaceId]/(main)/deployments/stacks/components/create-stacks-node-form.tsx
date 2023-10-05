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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NEARNetworks, PolkadotNetworks, StacksNetworks } from "@/enums";
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
import { BitcoinNode, Version } from "@/types";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  network: z.nativeEnum(StacksNetworks, {
    required_error: "Network is required",
  }),
  bitcoinNode: z
    .string({ required_error: "Bitcoin node is required" })
    .transform((value) => {
      const { name, p2pPort, rpcPort, rpcUsers } = JSON.parse(
        value
      ) as BitcoinNode;
      return {
        endpoint: name,
        p2pPort,
        rpcPort,
        rpcUsername: rpcUsers[0].username,
        rpcPasswordSecretName: rpcUsers[0].passwordSecretName,
      };
    }),
  workspace_id: z.string().min(1),
  image: z.string().min(1),
});

type Schema = z.input<typeof schema>;

export interface CreateStacksNodeFormProps {
  images: Version[];
  bitcoinNodes: BitcoinNode[];
}

export const CreateStacksNodeForm: React.FC<CreateStacksNodeFormProps> = ({
  images,
  bitcoinNodes,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();

  const defaultValues = {
    name: "",
    image: images[0].image,
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
      await client.post("/stacks/nodes", values);
      router.push(`/${workspaceId}/deployments/stacks`);
      router.refresh();
      toast({
        title: "Stacks node has been created",
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
                  {getSelectItems(StacksNetworks).map(({ value, label }) => (
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
            href="https://github.com/stacks-network/stacks-blockchain"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            Stacks
          </a>
        </p>

        <FormField
          control={form.control}
          name="bitcoinNode"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-6 lg:col-span-3">
              <FormLabel>Bitcoin Node</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger data-testid="network" className="bg-white">
                    <SelectValue placeholder="Select a Node" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bitcoinNodes
                    .filter(({ rpc }) => rpc)
                    .map((node) => (
                      <SelectItem key={node.name} value={JSON.stringify(node)}>
                        {node.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Bitcoin nodes with JSON-RPC server enabled
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
