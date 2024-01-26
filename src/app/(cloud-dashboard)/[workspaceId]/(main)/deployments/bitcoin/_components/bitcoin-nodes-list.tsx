import { Suspense } from "react";

import { BitcoinNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { BitcoinNetworks } from "@/enums";
import { getClientVersions } from "@/services/get-client-versions";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateBitcoinNodeButton } from "./create-bitcoin-node-button";

interface BitcoinNodesListProps {
  workspaceId: string;
}

export const BitcoinNodesList = async ({
  workspaceId,
}: BitcoinNodesListProps) => {
  const { data } = await getNodes<BitcoinNode>(workspaceId, "/bitcoin/nodes");

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "bitcoin",
        component: "node",
        client: "bitcoin-core",
      },
      node.image
    );

    const currentVersionName = versions.find(
      (version) => version.image === node.image
    )?.name;
    return { ...node, version: currentVersionName };
  });

  const nodes = await Promise.all(promises);

  if (!data.length) {
    return (
      <NoResult
        className="col-span-12"
        imageUrl="/images/bitcoin.svg"
        title="No Bitcoin Nodes"
        description="Bitcoin nodes retrieve and store data on the Bitcoin network."
        createUrl={`/${workspaceId}/deployments/bitcoin/new`}
        buttonText="New Bitcoin Node"
        workspaceId={workspaceId}
      />
    );
  }

  const mainNodesInfo = nodes.map(({ name, network, createdAt, version }) => ({
    name,
    network: getEnumKey(BitcoinNetworks, network),
    client: "Bitcoin Core",
    createdAt,
    version,
    url: `/${workspaceId}/deployments/bitcoin/${name}`,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateBitcoinNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
