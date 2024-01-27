import { BeaconNode } from "@/types";
import { BeaconNodeClients, BeaconNodeNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";

interface BeaconNodesListProps {
  workspaceId: string;
}

export const BeaconNodesList = async ({
  workspaceId,
}: BeaconNodesListProps) => {
  const { data } = await getNodes<BeaconNode>(
    workspaceId,
    "/ethereum2/beaconnodes"
  );

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/ethereum2.svg"
        title="No Beacon Nodes"
        description="Beacon Node implements the proof-of-stake consensus algorithm, and enables the network to achieve agreement based on validated data from the execution client."
        createUrl={`/${workspaceId}/deployments/ethereum/beacon-nodes/new`}
        buttonText="New Beacon Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "ethereum",
        component: "beaconNode",
        client: node.client,
      },
      node.image
    );

    const currentVersionName = versions.find(
      (version) => version.image === node.image
    )?.name;
    return { ...node, version: currentVersionName };
  });

  const nodes = await Promise.all(promises);

  const mainNodesInfo = nodes.map(
    ({ name, network, client, createdAt, version }) => ({
      name,
      network: getEnumKey(BeaconNodeNetworks, network),
      client: getEnumKey(BeaconNodeClients, client),
      url: `/${workspaceId}/deployments/ethereum/beacon-nodes/${name}`,
      createdAt,
      version,
    })
  );

  return <DeploymentsList data={mainNodesInfo} />;
};
