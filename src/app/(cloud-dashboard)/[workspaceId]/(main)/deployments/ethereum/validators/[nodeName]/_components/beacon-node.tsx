import { BeaconNode, ValidatorNode } from "@/types";
import { BeaconNodeClients, Roles } from "@/enums";

import { MultiSelect } from "@/components/form/multi-select";
import { Heading } from "@/components/ui/heading";

interface BeaconNodeProps {
  node: ValidatorNode;
  role: Roles;
  beaconNodes: BeaconNode[];
  errors?: Record<string, string[] | undefined>;
}

export const BeaconNodeConfig = ({
  node,
  role,
  beaconNodes,
  errors,
}: BeaconNodeProps) => {
  const { beaconEndpoints } = node;

  const activeBeaconNods = beaconNodes
    .filter(({ client, rest, rpc }) =>
      client === BeaconNodeClients["ConsenSys Teku"] ||
      client === BeaconNodeClients["Sigma Prime Lighthouse"]
        ? rest
        : rpc
    )
    .map(({ name, client, rpcPort, restPort }) => ({
      label: name,
      value: `http://${name}:${
        client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"]
          ? restPort
          : rpcPort
      }`,
    }));

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Beacon Node" id="beacon-node" />
      <MultiSelect
        id="beaconEndpoints"
        label="Beacon Node Endpoints"
        disabled={role === Roles.Reader}
        defaultValue={beaconEndpoints}
        placeholder="Select beacon nodes"
        options={activeBeaconNods}
        className="max-w-sm"
        errors={errors}
        allowCustomValues
      />
    </div>
  );
};
