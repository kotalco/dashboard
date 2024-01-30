"use client";

import { useParams } from "next/navigation";

import { OptionType, ValidatorNode } from "@/types";
import { Roles, SecretType, ValidatorClients } from "@/enums";

import { MultiSelect } from "@/components/form/multi-select";
import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface KeystoreProps {
  node: ValidatorNode;
  role: Roles;
  ethereumKeystores: OptionType[];
  passwords: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Keystore = ({
  node,
  role,
  ethereumKeystores,
  passwords,
  errors,
}: KeystoreProps) => {
  const { client, keystores, walletPasswordSecretName } = node;
  const { workspaceId } = useParams();

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Keystore" />
      <MultiSelect
        id="keystores"
        label="Ethereum Keystores"
        disabled={role === Roles.Reader}
        defaultValue={keystores.map(({ secretName }) => secretName)}
        placeholder="Select keystores"
        options={ethereumKeystores}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Ethereum Keystore"]}`,
          title: "Create New Keystore",
        }}
        errors={errors}
        className="max-w-sm"
      />

      {client === ValidatorClients["Prysatic Labs Prysm"] && (
        <Select
          id="walletPasswordSecretName"
          label="Prysm Client Wallet Password"
          disabled={role === Roles.Reader}
          className="max-w-sm"
          defaultValue={walletPasswordSecretName}
          placeholder="Select a Password"
          options={passwords}
          link={{
            href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
            title: "Create New Password",
          }}
          errors={errors}
        />
      )}
    </div>
  );
};
