"use client";

import { ChainlinkNode, ExecutionClientNode } from "@/types";
import { Roles } from "@/enums";
import { TabsFooter } from "@/components/ui/tabs";
import { SelectWithInput } from "@/components/form/select-with-input";
import { MultiSelect } from "@/components/form/multi-select";
import { useAction } from "@/hooks/use-action";
import { editExecutionClient } from "@/actions/edit-chainlink";
import { readSelectWithInputValue } from "@/lib/utils";
import { useParams } from "next/navigation";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

interface ExecutionClientTabProps {
  node: ChainlinkNode;
  role: Roles;
  executionClients: ExecutionClientNode[];
}

export const ExecutionClientTab: React.FC<ExecutionClientTabProps> = ({
  node,
  role,
  executionClients,
}) => {
  const { ethereumWsEndpoint, ethereumHttpEndpoints, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } =
    useAction(editExecutionClient);
  const wsActiveExecutionClients = executionClients
    .filter(({ ws }) => ws)
    .map(({ name, wsPort }) => ({
      label: name,
      value: `ws://${name}:${wsPort}`,
    }));

  const rpcActiveExecutionClients = executionClients
    .filter(({ rpc }) => rpc)
    .map(({ name, rpcPort }) => ({
      label: name,
      value: `http://${name}:${rpcPort}`,
    }));

  const onSubmit = async (formData: FormData) => {
    const ethereumWsEndpoint = readSelectWithInputValue(
      "ethereumWsEndpoint",
      formData
    );
    const ethereumHttpEndpoints = formData.getAll(
      "ethereumHttpEndpoints"
    ) as string[];

    execute(
      { ethereumWsEndpoint, ethereumHttpEndpoints },
      { name: name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <SelectWithInput
        id="ethereumWsEndpoint"
        label="Execution Client Websocket Endpoint"
        placeholder="Select an Execution Client"
        options={wsActiveExecutionClients}
        otherLabel="Externally Managed Node"
        description="Execution client nodes with WebSocket enabled"
        errors={fieldErrors}
        disabled={role === Roles.Reader}
        defaultValue={ethereumWsEndpoint}
      />

      <MultiSelect
        id="ethereumHttpEndpoints"
        label="Execution Client HTTP Endpoints"
        placeholder="Select an Execution Client"
        options={rpcActiveExecutionClients}
        errors={fieldErrors}
        disabled={role === Roles.Reader}
        defaultValue={ethereumHttpEndpoints}
        className="max-w-sm"
        allowCustomValues
      />

      <SubmitSuccess success={success}>
        Execution client settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <TabsFooter>
          <SubmitButton>Save</SubmitButton>
        </TabsFooter>
      )}
    </form>
  );
};
