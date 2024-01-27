import { AptosNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { AptosNetworks } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";

import { getClientVersions } from "@/services/get-client-versions";

interface AptosNodesListProps {
  workspaceId: string;
}

export const AptosNodesList = async ({ workspaceId }: AptosNodesListProps) => {
  const { data } = await getNodes<AptosNode>(workspaceId, "/aptos/nodes");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/aptos.svg"
        title="No Aptos Nodes"
        description="Aptos node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
        createUrl={`/${workspaceId}/deployments/aptos/new`}
        buttonText="New Aptos Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "aptos",
        component: "node",
        client: "aptos-core",
        network: node.network,
      },
      node.image
    );

    const currentVersionName = versions.find(
      (version) => version.image === node.image
    )?.name;
    return { ...node, version: currentVersionName };
  });

  const nodes = await Promise.all(promises);

  const mainNodesInfo = nodes.map(({ name, network, createdAt, version }) => ({
    name,
    network: getEnumKey(AptosNetworks, network),
    client: "Aptos Core",
    createdAt,
    version,
    url: `/${workspaceId}/deployments/aptos/${name}`,
  }));

  return <DeploymentsList data={mainNodesInfo} />;
};
