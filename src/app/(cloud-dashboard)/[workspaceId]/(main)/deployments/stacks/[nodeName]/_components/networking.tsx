"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { OptionType, StacksNode } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface NetWorkingProps {
  node: StacksNode;
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
  const { nodePrivateKeySecretName } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState(nodePrivateKeySecretName);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Networking" />
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
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
