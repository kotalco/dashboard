"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { getSelectItems } from "@/lib/utils";
import { ExecutionClientNode, OptionType } from "@/types";
import { ExecutionClientSyncMode, Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { Heading } from "@/components/ui/heading";

interface NetWorkingProps {
  node: ExecutionClientNode;
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
  const { nodePrivateKeySecretName, syncMode, staticNodes, bootnodes } = node;
  const { workspaceId } = useParams();
  const [privateKey, setPrivateKey] = useState<string | undefined>(
    nodePrivateKeySecretName
  );

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Networking" />{" "}
      <Select
        id="nodePrivateKeySecretName"
        label="Node Private Key"
        options={privateKeys}
        defaultValue={privateKey}
        value={privateKey}
        onValueChange={setPrivateKey}
        disabled={role === Roles.Reader}
        errors={errors}
        placeholder="Select a Secret"
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["Execution Client Private Key"]}`,
          title: "Create New Private Key",
        }}
        clear={{ onClear: () => setPrivateKey("") }}
        className="max-w-xs"
      />
      <Select
        id="syncMode"
        label="Sync Mode"
        options={getSelectItems(ExecutionClientSyncMode)}
        defaultValue={syncMode}
        disabled={role === Roles.Reader}
        errors={errors}
        className="max-w-xs"
      />
      <Textarea
        id="staticNodes"
        label="Static Nodes"
        defaultValue={staticNodes}
        disabled={role === Roles.Reader}
        errors={errors}
        description="One enodeURL per line"
        className="max-w-xs"
      />
      <Textarea
        id="bootnodes"
        label="Boot Nodes"
        defaultValue={bootnodes}
        disabled={role === Roles.Reader}
        errors={errors}
        description="One enodeURL per line"
        className="max-w-xs"
      />
    </div>
  );
};
