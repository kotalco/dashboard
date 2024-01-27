import { ExecutionClientNode } from "@/types";
import { ExecutionClientClients, ExecutionClientNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";

interface ExecutionClientsListProps {
  workspaceId: string;
}

export const ExecutionClientsList = async ({
  workspaceId,
}: ExecutionClientsListProps) => {
  const { data } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/ethereum.svg"
        title="No Execution Client Nodes"
        description="Execution client node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
        createUrl={`/${workspaceId}/deployments/ethereum/execution-clients/new`}
        buttonText="New Execution Client Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "ethereum",
        component: "executionEngine",
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
      network: getEnumKey(ExecutionClientNetworks, network),
      client: getEnumKey(ExecutionClientClients, client),
      createdAt,
      version,
      url: `/${workspaceId}/deployments/ethereum/execution-clients/${name}`,
    })
  );

  return <DeploymentsList data={mainNodesInfo} />;
};
