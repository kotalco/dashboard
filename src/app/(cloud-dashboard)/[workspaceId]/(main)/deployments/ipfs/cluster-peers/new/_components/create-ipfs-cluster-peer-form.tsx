"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getSelectItems, readSelectWithInputValue } from "@/lib/utils";
import { IPFSClusterPeer, IPFSPeer, OptionType, Version } from "@/types";
import { ConsensusAlgorithm, SecretType } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { createClusterPeer } from "@/actions/create-cluster-peer";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { SelectWithInput } from "@/components/form/select-with-input";
import { RadioGroup } from "@/components/form/radio-group";
import { MultiSelect } from "@/components/form/multi-select";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { Toggle } from "@/components/form/toggle";

interface CreateIPFSClusterPeerFormProps {
  images: Version[];
  clusterSecrets: OptionType[];
  privateKeys: OptionType[];
  peers: IPFSPeer[];
  clsuterPeers: IPFSClusterPeer[];
}

export const CreateIPFSClusterPeerForm: React.FC<
  CreateIPFSClusterPeerFormProps
> = ({ images, peers, clsuterPeers, clusterSecrets, privateKeys }) => {
  const params = useParams();
  const router = useRouter();
  const [isPredefined, setIsPrefined] = useState(false);
  const [consensus, setConsensus] = useState<string>();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createClusterPeer, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/ipfs?tab=cluster-peers`);
      toast.message("Cluster peer has been created", {
        description: `${name} peer has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

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

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const peerEndpoint = readSelectWithInputValue("peerEndpoint", formData);
    const clusterSecretName = formData.get("clusterSecretName") as string;
    const id = formData.get("id") as string;
    const privatekeySecretName = formData.get("privatekeySecretName") as string;
    const trustedPeers = formData.getAll("trustedPeers") as string[];
    const bootstrapPeers = formData.getAll("bootstrapPeers") as string[];

    execute({
      workspace_id: workspaceId as string,
      name,
      peerEndpoint,
      consensus: consensus as ConsensusAlgorithm,
      clusterSecretName,
      predefined: isPredefined,
      id,
      privatekeySecretName,
      trustedPeers,
      bootstrapPeers,
      image: images[0].image,
    });
  };

  return (
    <form data-testid="create-node" action={onSubmit} className="space-y-4">
      <Input
        errors={fieldErrors}
        id="name"
        label="Peer Name"
        className="max-w-xs"
      />

      <SelectWithInput
        id="peerEndpoint"
        label="IPFS Peer"
        placeholder="Select a Peer"
        options={peerEndoints}
        otherLabel="Use External Peer"
        className="max-w-xs"
        errors={fieldErrors}
      />

      <RadioGroup
        id="consensus"
        label="Consensus"
        value={consensus}
        onValueChange={setConsensus}
        defaultValue={consensus}
        className="flex ml-5 space-x-3"
        options={getSelectItems(ConsensusAlgorithm)}
        errors={fieldErrors}
      />

      <Select
        id="clusterSecretName"
        label="Cluster Secret Name"
        placeholder="Select a secret"
        options={clusterSecrets}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["IPFS Cluster Secret"]}`,
          title: "Create New Cluster Secret",
        }}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <Toggle
        id="predefined"
        checked={isPredefined}
        onCheckedChange={setIsPrefined}
        errors={fieldErrors}
        label="Do you want to start with predefined identity and private key?"
        labelPosition="right"
      />

      {isPredefined && (
        <>
          <Input errors={fieldErrors} id="id" label="ID" className="max-w-xs" />

          <Select
            id="privatekeySecretName"
            label="Private Key"
            placeholder="Select a secret"
            options={privateKeys}
            link={{
              href: `/${workspaceId}/secrets/new?type=${SecretType["IPFS Cluster Peer Key"]}`,
              title: "Create New Private Key",
            }}
            errors={fieldErrors}
            className="max-w-xs"
          />
        </>
      )}

      {consensus === ConsensusAlgorithm.CRDT && (
        <MultiSelect
          id="trustedPeers"
          label="Trusted Cluster Peers"
          placeholder="Select trusted peers"
          options={trustedPeers}
          allowCustomValues
          className="max-w-xs"
          errors={fieldErrors}
        />
      )}

      <MultiSelect
        id="bootstrapPeers"
        label="Bootstrap Cluster Peers (Optional)"
        placeholder="Select bootstrap peers"
        options={bootstrapPeers}
        allowCustomValues
        className="max-w-xs"
        errors={fieldErrors}
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
