"use client";

import { useParams } from "next/navigation";

import { BeaconNode, ExecutionClientNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Select } from "@/components/form/select";
import { SelectWithInput } from "@/components/form/select-with-input";
import { Heading } from "@/components/ui/heading";

interface ExecutionClientProps {
  node: BeaconNode;
  executionClients: ExecutionClientNode[];
  role: Roles;
  jwts: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const ExecutionClient = ({
  node,
  role,
  jwts,
  executionClients,
  errors,
}: ExecutionClientProps) => {
  const { executionEngineEndpoint, jwtSecretName } = node;
  const { workspaceId } = useParams();

  const activeExecutionClients = executionClients
    .filter(({ engine }) => engine)
    .map(({ enginePort, name }) => ({
      label: name,
      value: `http://${name}:${enginePort}`,
    }));

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Execution Client" />{" "}
      <SelectWithInput
        id="executionEngineEndpoint"
        label="Execution Engine Endpoint"
        placeholder="Select a Node"
        disabled={role === Roles.Reader}
        defaultValue={executionEngineEndpoint}
        options={activeExecutionClients}
        otherLabel="Use External Node"
        description="Nodes must have activated engine port"
        errors={errors}
        className="max-w-xs"
      />
      <Select
        id="jwtSecretName"
        label="JWT Secret"
        placeholder="Select a Secret"
        disabled={role === Roles.Reader}
        defaultValue={jwtSecretName}
        errors={errors}
        options={jwts}
        link={{
          href: `/${workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`,
          title: "Create New JWT Secret",
        }}
        className="max-w-xs"
      />
    </div>
  );
};
