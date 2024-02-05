"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, PolkadotNode } from "@/types";
import { PolkadotSyncModes, Roles, SecretType } from "@/enums";
import { getSelectItems } from "@/lib/utils";

import { Select } from "@/components/form/select";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface NetWorkingProps {
  node: PolkadotNode;
  role: Roles;
  privateKeys: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Networking = ({
  node,
  role,
  privateKeys,
  errors,
}: NetWorkingProps) => {
  const { nodePrivateKeySecretName, syncMode, retainedBlocks, pruning } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Networking" />
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        placeholder="Select a Secret"
        disabled={role === Roles.Reader}
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        options={privateKeys}
        errors={errors}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Polkadot Private Key"]}`,
          title: "Create New Private Key",
        }}
        className="max-w-xs"
        clear={{ onClear: () => setPrivateKey("") }}
      />

      <Select
        id="syncMode"
        label="Sync Mode"
        disabled={role === Roles.Reader}
        defaultValue={syncMode}
        options={getSelectItems(PolkadotSyncModes)}
        errors={errors}
        className="max-w-xs"
      />

      <Toggle id="pruning" label="Pruning" disabled defaultChecked={pruning} />

      <Input
        id="retainedBlocks"
        label="Retain Blocks"
        disabled={role === Roles.Reader}
        defaultValue={retainedBlocks}
        errors={errors}
        className="max-w-xs"
      />
    </div>
  );
};
