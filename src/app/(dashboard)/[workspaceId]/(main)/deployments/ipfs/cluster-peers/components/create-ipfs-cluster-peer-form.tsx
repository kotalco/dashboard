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
import {
  Clients,
  ExecutionClientNode,
  IPFSClusterPeer,
  IPFSPeer,
  Secret,
  Version,
} from "@/types";
import {
  BeaconNodeClients,
  BeaconNodeNetworks,
  ConsensusAlgorithm,
  SecretType,
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
import { SelectWithInput } from "@/components/ui/select-with-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";

interface CreateIPFSClusterPeerFormProps {
  images: Version[];
  clusterSecrets: Secret[];
  privateKeys: Secret[];
  peers: IPFSPeer[];
  clsuterPeers: IPFSClusterPeer[];
}

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Peer name is required")
      .max(64, "Too long name")
      .trim()
      .refine((value) => /^\S*$/.test(value), {
        message: "Invalid character used",
      }),
    peerEndpoint: z
      .string({ required_error: "Peer endpoint is required" })
      .min(1, "Peer endpoint is required")
      .trim(),
    consensus: z.nativeEnum(ConsensusAlgorithm, {
      required_error: "Consensus algorithm is required",
    }),
    predefined: z.boolean().optional(),
    clusterSecretName: z.string({
      required_error: "Cluster secret is required",
    }),
    id: z.string().optional(),
    privatekeySecretName: z.string().optional(),
    trustedPeers: z.string().array().optional(),
    bootstrapPeers: z.string().array().optional(),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .refine(
    ({ consensus, trustedPeers }) =>
      (consensus === ConsensusAlgorithm.CRDT && !!trustedPeers?.length) ||
      consensus !== ConsensusAlgorithm.CRDT,
    {
      message: "Please select your trusted peers or enter your own peers",
      path: ["trustedPeers"],
    }
  )
  .refine(
    ({ predefined, privatekeySecretName, id }) =>
      (predefined && privatekeySecretName && id) || !predefined,
    {
      message: "Please enter id and private key secret name",
      path: ["predefined"],
    }
  )
  .transform((values) => {
    delete values.predefined;
    return values;
  });

type Schema = z.input<typeof schema>;

export const CreateIPFSClusterPeerForm: React.FC<
  CreateIPFSClusterPeerFormProps
> = ({ images, peers, clsuterPeers, clusterSecrets, privateKeys }) => {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { workspaceId } = useParams();
  const peerEndoints = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const bootstrapPeers = clsuterPeers.map(({ name, id }) => ({
    label: name,
    value: `/dns4/${name}/tcp/9096/p2p/${id}`,
  }));

  const trustedPeers = clsuterPeers.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", image: images[0].image },
  });

  const {
    formState: { isSubmitted, isSubmitting, isValid, isDirty, errors },
    watch,
    setError,
    setValue,
  } = form;

  const [isPredefined, consensus] = watch(["predefined", "consensus"]);

  async function onSubmit(values: Schema) {
    try {
      await client.post("/ipfs/clusterpeers", values);
      router.push(`/${workspaceId}/deployments/ipfs?deployment=cluster-peers`);
      router.refresh();
      toast({
        title: "Cluster peer has been created",
        description: `${values.name} peer has been created successfully, and will be up and running in few seconds.`,
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
        className="space-y-4"
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
              <FormLabel>Peer Name</FormLabel>
              <FormControl>
                <Input
                  className="max-w-xs"
                  data-testid="name"
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
          name="peerEndpoint"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>IPFS Peer</FormLabel>
              <SelectWithInput
                placeholder="Select a Peer"
                disabled={isSubmitting}
                onChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                options={peerEndoints}
                otherLabel="Use External Peer"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consensus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Consensus</FormLabel>
              <FormControl>
                <RadioGroup
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex ml-5 space-x-3"
                >
                  {getSelectItems(ConsensusAlgorithm).map(
                    ({ value, label }) => (
                      <FormItem
                        key={value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clusterSecretName"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Cluster Secret Name</FormLabel>
              <div className="flex items-center gap-x-2 max-w-xs">
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
                      <SelectValue placeholder="Select a secret" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clusterSecrets.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                    <Link
                      href={`/${params.workspaceId}/secrets/new?type=${SecretType["IPFS Cluster Secret"]}`}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Create New Cluster Secret
                    </Link>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="predefined"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center gap-x-3">
                <FormControl>
                  <Switch
                    disabled={isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-base">
                  Do you want to start with predefined identity and private key?
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPredefined && (
          <>
            <FormField
              shouldUnregister={true}
              control={form.control}
              name="id"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-xs"
                      data-testid="name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              shouldUnregister={true}
              control={form.control}
              name="privatekeySecretName"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Private Key</FormLabel>
                  <div className="flex items-center gap-x-2 max-w-xs">
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
                          <SelectValue placeholder="Select a secret" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {privateKeys.map(({ name }) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                        <Link
                          href={`/${params.workspaceId}/secrets/new?type=${SecretType["IPFS Cluster Peer Key"]}`}
                          className="text-sm text-primary hover:underline underline-offset-4"
                        >
                          Create New Private Key
                        </Link>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {consensus === ConsensusAlgorithm.CRDT && (
          <FormField
            shouldUnregister={true}
            control={form.control}
            name="trustedPeers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trusted Cluster Peers</FormLabel>
                <div>
                  <div className="max-w-xs">
                    <MultiSelect
                      defaultValue={field.value || []}
                      disabled={isSubmitting}
                      value={field.value || []}
                      placeholder="Select trusted peers"
                      options={trustedPeers}
                      onChange={field.onChange}
                      emptyText="Enter your own peers or * to trust all peers"
                      allowCustomValues
                    />
                  </div>
                  <FormDescription>
                    Select cluster peers or enter your own peers, You can also
                    use * to trust all peers
                  </FormDescription>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          shouldUnregister={true}
          control={form.control}
          name="bootstrapPeers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bootstrap Cluster Peers <strong>(Optional)</strong>
              </FormLabel>
              <div>
                <div className="max-w-xs">
                  <MultiSelect
                    defaultValue={field.value}
                    disabled={isSubmitting}
                    value={field.value}
                    placeholder="Select bootstrap peers"
                    options={bootstrapPeers}
                    onChange={field.onChange}
                    emptyText="Enter your own peers"
                    allowCustomValues
                  />
                </div>
                <FormDescription>
                  Select cluster peers or enter your own peers
                </FormDescription>
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
