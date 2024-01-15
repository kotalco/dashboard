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
import { useAction } from "@/hooks/use-action";
import { editAPI } from "@/actions/edit-execution-client";
import { getSelectItems } from "@/lib/utils";

import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { CheckboxGroup } from "@/components/form/checkbox-group";

interface APITabProps {
  node: ExecutionClientNode;
  role: Roles;
  secrets: OptionType[];
}

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const {
    engine,
    jwtSecretName,
    rpc,
    rpcAPI,
    ws,
    wsAPI,
    graphql,
    name,
    client,
  } = node;
  const { workspaceId } = useParams();
  const [engineState, setEngineState] = useState(engine);
  const [rpcState, setRpcState] = useState(rpc);
  const [wsState, setWsState] = useState(ws);
  const { execute, success, error, fieldErrors } = useAction(editAPI);

  const onSubmit = (formData: FormData) => {
    const engine = formData.get("engine") === "on";
    const jwtSecretName = formData.get("jwtSecretName") as string;
    const rpc = formData.get("rpc") === "on";
    const rpcAPI = formData.getAll("rpcAPI") as ExecutionClientAPI[];
    const ws = formData.get("ws") === "on";
    const wsAPI = formData.getAll("wsAPI") as ExecutionClientAPI[];
    const graphql = formData.get("graphql") === "on";

    execute(
      { engine, jwtSecretName, rpc, rpcAPI, ws, wsAPI, graphql, client },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="p-4 border rounded-lg">
        <Toggle
          id="engine"
          label="Execution Engine RPC"
          defaultChecked={engine}
          checked={engineState}
          onCheckedChange={setEngineState}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />

        {engineState && (
          <Select
            id="jwtSecretName"
            label="JWT Secret"
            options={secrets}
            defaultValue={jwtSecretName || undefined}
            placeholder="Select a Secret"
            disabled={role === Roles.Reader}
            errors={fieldErrors}
            link={{
              href: `/${workspaceId}/secrets/new?type=${SecretType["JWT Secret"]}`,
              title: "Create New JWT Secret",
            }}
            className="max-w-xs"
          />
        )}
      </div>

      <div className="p-4 border rounded-lg">
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          defaultChecked={rpc}
          checked={rpcState}
          onCheckedChange={setRpcState}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />

        {rpcState && (
          <CheckboxGroup
            label="Select which APIs you want to use"
            className="flex space-x-10"
            options={getSelectItems(ExecutionClientAPI)}
            id="rpcAPI"
            errors={fieldErrors}
            disabled={role === Roles.Reader}
            defaultValues={rpcAPI}
          />
        )}
      </div>

      <div className="p-4 border rounded-lg">
        <Toggle
          id="ws"
          label="Web Socket Server"
          defaultChecked={ws}
          checked={wsState}
          onCheckedChange={setWsState}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />

        {wsState && (
          <CheckboxGroup
            label="Select which APIs you want to use"
            className="flex space-x-10"
            options={getSelectItems(ExecutionClientAPI)}
            id="wsAPI"
            errors={fieldErrors}
            disabled={role === Roles.Reader}
            defaultValues={wsAPI}
          />
        )}
      </div>

      {client !== ExecutionClientClients.Nethermind && (
        <div className="p-4 border rounded-lg">
          <Toggle
            id="graphql"
            label="GraphQl Server"
            defaultChecked={graphql}
            disabled={role === Roles.Reader}
            errors={fieldErrors}
            className="justify-between"
          />
        </div>
      )}

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
