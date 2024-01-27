import { Suspense } from "react";

import { getEnumKey } from "@/lib/utils";
import { FilecoinNetworks } from "@/enums";
import { FilecoinNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateFileCoinNodeButton } from "./create-filecoin-node-button";

interface FilecoinNodesListProps {
  workspaceId: string;
}

export const FilecoinNodesList = async ({
  workspaceId,
}: FilecoinNodesListProps) => {
  const { data } = await getNodes<FilecoinNode>(workspaceId, "/filecoin/nodes");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/filecoin.svg"
        title="No Filecoin Nodes"
        description="Filecoin nodes retrieve and store data on the Filecoin network."
        createUrl={`/${workspaceId}/deployments/filecoin/new`}
        buttonText="New Filecoin Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "filecoin",
        component: "node",
        client: "lotus",
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
    network: getEnumKey(FilecoinNetworks, network),
    client: "Lotus",
    url: `/${workspaceId}/deployments/filecoin/${name}`,
    createdAt,
    version,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateFileCoinNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>
      <DeploymentsList data={mainNodesInfo} />;
    </>
  );
};
