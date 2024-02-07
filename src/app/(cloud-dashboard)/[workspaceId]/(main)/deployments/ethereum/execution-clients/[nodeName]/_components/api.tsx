"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { ExecutionClientNode, OptionType } from "@/types";
import {
  ExecutionClientAPI,
  ExecutionClientClients,
  Roles,
  SecretType,
} from "@/enums";
import { getSelectItems } from "@/lib/utils";

import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { CheckboxGroup } from "@/components/form/checkbox-group";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: ExecutionClientNode;
  role: Roles;
  jwts: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, jwts, errors }: ApiProps) => {
  const { engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql, client } =
    node;
  const { workspaceId } = useParams();
  const [engineState, setEngineState] = useState(engine);
  const [rpcState, setRpcState] = useState(rpc);
  const [wsState, setWsState] = useState(ws);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" id="api" />

      <Toggle
        id="engine"
        label="Execution Engine RPC"
        defaultChecked={engine}
        checked={engineState}
        onCheckedChange={setEngineState}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      {engineState && (
        <Select
          id="jwtSecretName"
          label="JWT Secret"
          options={jwts}
          defaultValue={jwtSecretName || undefined}
          placeholder="Select a Secret"
          disabled={role === Roles.Reader}
          errors={errors}
          link={{
            href: `/${workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`,
            title: "Create New JWT Secret",
          }}
          className="max-w-xs"
        />
      )}

      <Toggle
        id="rpc"
        label="JSON-RPC Server"
        defaultChecked={rpc}
        checked={rpcState}
        onCheckedChange={setRpcState}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      {rpcState && (
        <CheckboxGroup
          label="Select which APIs you want to use"
          className="flex space-x-10"
          options={getSelectItems(ExecutionClientAPI)}
          id="rpcAPI"
          errors={errors}
          disabled={role === Roles.Reader}
          defaultValues={rpcAPI}
        />
      )}

      <Toggle
        id="ws"
        label="Web Socket Server"
        defaultChecked={ws}
        checked={wsState}
        onCheckedChange={setWsState}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      {wsState && (
        <CheckboxGroup
          label="Select which APIs you want to use"
          className="flex space-x-10"
          options={getSelectItems(ExecutionClientAPI)}
          id="wsAPI"
          errors={errors}
          disabled={role === Roles.Reader}
          defaultValues={wsAPI}
        />
      )}

      {client !== ExecutionClientClients.Nethermind && (
        <Toggle
          id="graphql"
          label="GraphQl Server"
          defaultChecked={graphql}
          disabled={role === Roles.Reader}
          errors={errors}
        />
      )}
    </div>
  );
};
