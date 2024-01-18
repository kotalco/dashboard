import Link from "next/link";
import { Plus } from "lucide-react";

import { AptosNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getEnumKey } from "@/lib/utils";
import { AptosNetworks, Roles } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { getWorkspace } from "@/services/get-workspace";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateAptosNodeButton } from "./create-aptos-node-button";

interface AptosNodesListProps {
  workspaceId: string;
}

export const AptosNodesList = async ({ workspaceId }: AptosNodesListProps) => {
  const { data } = await getNodes<AptosNode>(workspaceId, "/aptos/nodes");

  if (!data.length) {
    return (
      <NoResult
        className="col-span-12"
        imageUrl="/images/aptos.svg"
        title="No Aptos Nodes"
        description="Aptos node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
        createUrl={`/${workspaceId}/deployments/aptos/new`}
        buttonText="Create New Aptos Node"
        workspaceId={workspaceId}
      />
    );
  }

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(AptosNetworks, network),
    client: "Aptos Core",
    url: `/${workspaceId}/deployments/aptos/${name}`,
  }));

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateAptosNodeButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainNodesInfo} />
    </>
  );
};
