"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getLatestVersion,
  getSelectItems,
  readSelectWithInputValue,
} from "@/lib/utils";
import { BeaconNode, Clients, OptionType } from "@/types";
import {
  BeaconNodeClients,
  SecretType,
  ValidatorClients,
  ValidatorNetworks,
} from "@/enums";
import { useAction } from "@/hooks/use-action";
import { createValidator } from "@/actions/create-validator";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { SelectWithInput } from "@/components/form/select-with-input";
import { MultiSelect } from "@/components/form/multi-select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

interface CreateValidatorNodeFormProps {
  images: Clients;
  beaconNodes: BeaconNode[];
  passwords: OptionType[];
  keystores: OptionType[];
}

export const CreateValidatorNodeForm: React.FC<
  CreateValidatorNodeFormProps
> = ({ images, beaconNodes, passwords, keystores }) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const [selectedClient, setSelectedClient] = useState<string>();
  const { execute, fieldErrors, error, success } = useAction(createValidator, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/ethereum?deployment=validators`);
      toast.message("Validator node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

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

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const client = selectedClient as ValidatorClients;
    const network = readSelectWithInputValue("network", formData);
    const keystores = formData.getAll("keystores") as [string, ...string[]];
    const walletPasswordSecretName = formData.get(
      "walletPasswordSecretName"
    ) as string;
    const beaconEndpoints = formData.getAll("beaconEndpoints") as [
      string,
      ...string[]
    ];

    execute({
      name,
      client,
      network,
      keystores,
      walletPasswordSecretName,
      beaconEndpoints,
      workspace_id: workspaceId as string,
      image: getLatestVersion(images, client)!,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xs space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="client"
        label="Client"
        placeholder="Select Client"
        value={selectedClient}
        onValueChange={setSelectedClient}
        options={getSelectItems(ValidatorClients)}
        errors={fieldErrors}
      />

      <SelectWithInput
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(ValidatorNetworks)}
        errors={fieldErrors}
        otherLabel="Other Network"
      />

      <MultiSelect
        id="keystores"
        label="Ethereum Keystores"
        placeholder="Select keystores"
        options={keystores}
        errors={fieldErrors}
        className="max-w-sm"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Ethereum Keystore"]}`,
          title: "Create New Keystore",
        }}
      />

      {selectedClient === ValidatorClients["Prysatic Labs Prysm"] && (
        <Select
          id="walletPasswordSecretName"
          label="Prysm Client Wallet Password"
          placeholder="Select a Password"
          options={passwords}
          errors={fieldErrors}
          link={{
            href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
            title: "Create New Password",
          }}
        />
      )}

      <MultiSelect
        id="beaconEndpoints"
        label="Beacon Node Endpoints"
        placeholder="Select beacon nodes"
        options={activeBeaconNods}
        errors={fieldErrors}
        className="max-w-sm"
        allowCustomValues
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
