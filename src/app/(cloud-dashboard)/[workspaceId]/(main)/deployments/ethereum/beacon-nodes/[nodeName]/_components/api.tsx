import { BeaconNode } from "@/types";
import { BeaconNodeClients, Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: BeaconNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, errors }: ApiProps) => {
  const { rest, rpc, grpc, client } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" id="api" />
      {(client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"] ||
        client === BeaconNodeClients["Status.im Nimbus"]) && (
        <Toggle
          id="rest"
          label="REST API Server"
          disabled={role === Roles.Reader}
          defaultChecked={rest}
          errors={errors}
        />
      )}

      {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          disabled
          defaultChecked={rpc}
          description="JSON-RPC Server cann't be disabled for Prysm."
          errors={errors}
        />
      )}

      {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
        <Toggle
          id="grpc"
          label="GRPC Gateway Server"
          disabled={role === Roles.Reader}
          defaultChecked={grpc}
          errors={errors}
          className="justify-between"
        />
      )}
    </div>
  );
};
