"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { Input } from "@/components/form/input";
import { Heading } from "@/components/ui/heading";

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
  const { nodePrivateKeySecretName, minPeers, p2pPort, bootnodes } = node;
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

      <Input
        id="minPeers"
        label="Minimum Peers"
        disabled={role === Roles.Reader}
        defaultValue={minPeers}
        errors={errors}
        className="max-w-xs"
      />

      <Input
        id="p2pPort"
        label="P2P Port"
        disabled={role === Roles.Reader}
        defaultValue={p2pPort}
        errors={errors}
        className="max-w-xs"
      />

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
