import { Suspense } from "react";

import { NEARNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NEARNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateNEARNodeButton } from "./create-near-node-button";

interface NEARNodesListProps {
  workspaceId: string;
}

export const NEARNodesList = async ({ workspaceId }: NEARNodesListProps) => {
  const { data } = await getNodes<NEARNode>(workspaceId, "/near/nodes");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/near.svg"
        title="No NEAR Nodes"
        description="NEAR node syncs NEAR Blockchain network, and propagates transactions to the connected peers."
        createUrl={`/${workspaceId}/deployments/near/new`}
        buttonText="New NEAR Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "near",
        component: "node",
        client: "nearcore",
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
    network: getEnumKey(NEARNetworks, network),
    client: "Near Core",
    url: `/${workspaceId}/deployments/near/${name}`,
    createdAt,
    version,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateNEARNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
