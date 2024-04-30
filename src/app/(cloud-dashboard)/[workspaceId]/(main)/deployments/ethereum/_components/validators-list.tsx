import { ValidatorNode } from "@/types";
import { ValidatorClients, ValidatorNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";

interface ValidatorsListProps {
  workspaceId: string;
}

export const ValidatorsList = async ({ workspaceId }: ValidatorsListProps) => {
  const { data } = await getNodes<ValidatorNode>(
    workspaceId,
    "/ethereum2/validators"
  );

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/ethereum2.svg"
        title="No Validator Nodes"
        description="Validator produces blocks, which contain consensus information about shards across the network, and votes on the validity of blocks that have already been produced."
        createUrl={`/${workspaceId}/deployments/ethereum/validators/new`}
        buttonText="New Validator Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "ethereum",
        component: "validatorClient",
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
      network: getEnumKey(ValidatorNetworks, network),
      client: getEnumKey(ValidatorClients, client),
      url: `/${workspaceId}/deployments/ethereum/validators/${name}`,
      createdAt,
      version,
    })
  );

  return <DeploymentsList data={mainNodesInfo} />;
};
