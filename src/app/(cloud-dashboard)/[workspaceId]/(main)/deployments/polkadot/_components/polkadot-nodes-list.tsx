import { Suspense } from "react";

import { PolkadotNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { PolkadotNetworks } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreatePolkadotNodeButton } from "./create-polkadot-node-button";
import { getClientVersions } from "@/services/get-client-versions";

interface PolkadotNodesListProps {
  workspaceId: string;
}

export const PolkadotNodesList = async ({
  workspaceId,
}: PolkadotNodesListProps) => {
  const { data } = await getNodes<PolkadotNode>(workspaceId, "/polkadot/nodes");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/polkadot.svg"
        title="No Polkadot Nodes"
        description="Polkadot node syncs Polkadot different networks and propagates transactions to the connected peers."
        createUrl={`/${workspaceId}/deployments/polkadot/new`}
        buttonText="New Polkadot Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "polkadot",
        component: "node",
        client: "polkadot",
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
    network: getEnumKey(PolkadotNetworks, network),
    client: "Parity Polkadot",
    url: `/${workspaceId}/deployments/polkadot/${name}`,
    createdAt,
    version,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreatePolkadotNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
