import { ChainlinkNode, ExecutionClientNode } from "@/types";
import { Roles } from "@/enums";

import { SelectWithInput } from "@/components/form/select-with-input";
import { MultiSelect } from "@/components/form/multi-select";
import { Heading } from "@/components/ui/heading";

interface ExecutionClientProps {
  node: ChainlinkNode;
  role: Roles;
  executionClients: ExecutionClientNode[];
  errors?: Record<string, string[] | undefined>;
}

export const ExecutionClient = ({
  node,
  role,
  executionClients,
  errors,
}: ExecutionClientProps) => {
  const { ethereumWsEndpoint, ethereumHttpEndpoints } = node;

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

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Execution Client" />
      <SelectWithInput
        id="ethereumWsEndpoint"
        label="Execution Client Websocket Endpoint"
        placeholder="Select an Execution Client"
        options={wsActiveExecutionClients}
        otherLabel="Externally Managed Node"
        description="Execution client nodes with WebSocket enabled"
        errors={errors}
        disabled={role === Roles.Reader}
        defaultValue={ethereumWsEndpoint}
        className="max-w-xs"
      />

      <MultiSelect
        id="ethereumHttpEndpoints"
        label="Execution Client HTTP Endpoints"
        placeholder="Select an Execution Client"
        options={rpcActiveExecutionClients}
        errors={errors}
        disabled={role === Roles.Reader}
        defaultValue={ethereumHttpEndpoints}
        className="max-w-xs"
        allowCustomValues
      />
    </div>
  );
};
