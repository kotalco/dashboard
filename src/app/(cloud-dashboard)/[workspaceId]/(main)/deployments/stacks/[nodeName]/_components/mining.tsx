"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, StacksNode } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface MiningProps {
  node: StacksNode;
  privateKeys: OptionType[];
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Mining = ({ node, role, privateKeys, errors }: MiningProps) => {
  const { mineMicroBlocks, miner, seedPrivateKeySecretName } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(seedPrivateKeySecretName);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Mining" />
      <Toggle
        id="miner"
        label="Miner"
        disabled={role === Roles.Reader}
        defaultChecked={miner}
        errors={errors}
      />
      <Toggle
        id="mineMicroBlocks"
        label="Mine Micro Blocks"
        disabled={role === Roles.Reader}
        defaultChecked={mineMicroBlocks}
        errors={errors}
      />

      <Select
        id="seedPrivateKeySecretName"
        label="Seed Private Key"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultValue={privateKey}
        options={privateKeys}
        placeholder="Select a private key"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Stacks Private Key"]}`,
          title: "Create New Private Key",
        }}
        value={privateKey}
        onValueChange={setPrivateKey}
        clear={{
          onClear: () => {
            setPrivateKey("");
          },
        }}
        className="max-w-xs"
      />
    </div>
  );
};
