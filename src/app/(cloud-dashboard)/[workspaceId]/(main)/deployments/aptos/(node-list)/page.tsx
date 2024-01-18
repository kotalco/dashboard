import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { AptosNetworks, Roles } from "@/enums";
import { AptosNode } from "@/types";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/no-result";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { data } = await getNodes<AptosNode>(workspaceId, "/aptos/nodes");
  const { role } = await getWorkspace(params.workspaceId);
  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(AptosNetworks, network),
    client: "aptos-core",
    url: `/${params.workspaceId}/deployments/aptos/${name}`,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="Aptos Deployments" />

          {role !== Roles.Reader && !!data.length && (
            <Button asChild>
              <Link href={`/${params.workspaceId}/deployments/aptos/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Aptos Node
              </Link>
            </Button>
          )}
        </div>

        <DeploymentsList data={mainNodesInfo} />
        {!data.length && (
          <NoResult
            imageUrl="/images/aptos.svg"
            title="No Aptos Nodes"
            description="Aptos node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
            createUrl={`/${params.workspaceId}/deployments/aptos/new`}
            buttonText="Create New Aptos Node"
            role={role}
          />
        )}
      </div>
    </div>
  );
}
