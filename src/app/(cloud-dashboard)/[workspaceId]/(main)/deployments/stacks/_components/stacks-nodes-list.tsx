import { Suspense } from "react";

import { StacksNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { StacksNetworks } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateStacksNodeButton } from "./create-stacks-node-button";
import { getClientVersions } from "@/services/get-client-versions";

interface StacksNodesListProps {
  workspaceId: string;
}

export const StacksNodesList = async ({
  workspaceId,
}: StacksNodesListProps) => {
  const { data } = await getNodes<StacksNode>(workspaceId, "/stacks/nodes");

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/stacks.svg"
        title="No Stacks Nodes"
        description="Stacks node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
        createUrl={`/${workspaceId}/deployments/stacks/new`}
        buttonText="New Stacks Node"
        workspaceId={workspaceId}
      />
    );
  }

  const promises = data.map(async (node) => {
    const { versions } = await getClientVersions(
      {
        protocol: "stacks",
        component: "node",
        client: "stacks-node",
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
    network: getEnumKey(StacksNetworks, network),
    client: "Stacks",
    url: `/${workspaceId}/deployments/stacks/${name}`,
    createdAt,
    version,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateStacksNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
