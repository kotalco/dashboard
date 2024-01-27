import { Suspense } from "react";

import { ChainlinkNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { ChainlinkNetworks } from "@/enums";
import { getClientVersions } from "@/services/get-client-versions";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateChainlinkNodeButton } from "./create-chainlink-node-button";

interface ChainlinkNodesListProps {
  workspaceId: string;
}

export const ChainlinkNodesList = async ({
  workspaceId,
}: ChainlinkNodesListProps) => {
  const { data } = await getNodes<ChainlinkNode>(
    workspaceId,
    "/chainlink/nodes"
  );

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/chainlink.svg"
        title="No Chainlink Nodes"
        description="Chainlink node connects smart contracts with external data using a decentralized oracle network."
        createUrl={`/${workspaceId}/deployments/chainlink/new`}
        buttonText="New Chainlink Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "chainlink",
        component: "node",
        client: "chainlink",
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
    ({ name, ethereumChainId, linkContractAddress, createdAt, version }) => ({
      name,
      network: getEnumKey(
        ChainlinkNetworks,
        `${ethereumChainId}:${linkContractAddress}`
      ),
      client: "Chainlink",
      createdAt,
      version,
      url: `/${workspaceId}/deployments/chainlink/${name}`,
    })
  );

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateChainlinkNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
