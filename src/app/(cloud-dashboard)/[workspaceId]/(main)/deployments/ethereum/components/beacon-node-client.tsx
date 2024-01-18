"use client";

import { useParams } from "next/navigation";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { BeaconNode } from "@/types";
import { BeaconNodeClients, BeaconNodeNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";

interface BeaconNodesClientProps {
  data: BeaconNode[];
  role: Roles;
}

export const BeaconNodesClient: React.FC<BeaconNodesClientProps> = ({
  data,
  role,
}) => {
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network, client }) => ({
    name,
    network: getEnumKey(BeaconNodeNetworks, network),
    client: getEnumKey(BeaconNodeClients, client),
    url: `/${params.workspaceId}/deployments/ethereum/beacon-nodes/${name}`,
  }));

  return (
    <>
      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/ethereum2.svg"
          title="No Beacon Nodes"
          description="Beacon Node implements the proof-of-stake consensus algorithm, and enables the network to achieve agreement based on validated data from the execution client."
          createUrl={`/${params.workspaceId}/deployments/ethereum/beacon-nodes/new`}
          buttonText="Create New Beacon Node"
          role={role}
        />
      )}
    </>
  );
};
