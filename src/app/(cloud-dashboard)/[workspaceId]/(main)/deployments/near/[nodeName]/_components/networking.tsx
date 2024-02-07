"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/ui/heading";
import { Slider } from "@/components/form/slider";

interface NetworkingProps {
  node: NEARNode;
  role: Roles;
  privateKeys: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Networking = ({
  node,
  role,
  privateKeys,
  errors,
}: NetworkingProps) => {
  const { nodePrivateKeySecretName, minPeers, bootnodes } = node;
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);
  const { workspaceId } = useParams();

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Networking" />
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        disabled={role === Roles.Reader}
        placeholder="Select a Secret"
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        options={privateKeys}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["NEAR Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setPrivateKey("") }}
        errors={errors}
        className="max-w-xs"
      />

      <div className="max-w-xs">
        <Slider
          id="minPeers"
          label="Minimum Peers"
          defaultValue={[minPeers.toString()]}
          min={3}
          max={60}
          step={3}
          unit="Peers"
          disabled={role === Roles.Reader}
          errors={errors}
        />
      </div>

      <Textarea
        id="bootnodes"
        label="Boot Nodes"
        disabled={role === Roles.Reader}
        defaultValue={bootnodes?.join("\n")}
        errors={errors}
        description="One node URL per line"
        className="max-w-xs"
      />
    </div>
  );
};
