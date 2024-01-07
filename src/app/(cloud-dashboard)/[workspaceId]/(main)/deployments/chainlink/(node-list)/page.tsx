import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { ChainlinkNetworks, Roles } from "@/enums";
import { ChainlinkNode } from "@/types";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/no-result";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { data } = await getNodes<ChainlinkNode>(
    workspaceId,
    "/chainlink/nodes"
  );
  const { role } = await getWorkspace(workspaceId);
  const mainNodesInfo = data.map(
    ({ name, ethereumChainId, linkContractAddress }) => ({
      name,
      network: getEnumKey(
        ChainlinkNetworks,
        `${ethereumChainId}:${linkContractAddress}`
      ),
      client: "Chainlink",
      url: `/${workspaceId}/deployments/chainlink/${name}`,
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pl-0 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="Chainlink Deployments" />

          {role !== Roles.Reader && !!data.length && (
            <Button asChild>
              <Link href={`/${workspaceId}/deployments/chainlink/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Chainlink Node
              </Link>
            </Button>
          )}
        </div>
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/chainlink.svg"
          title="No Chainlink Nodes"
          description="Chainlink node connects smart contracts with external data using a decentralized oracle network."
          createUrl={`/${workspaceId}/deployments/chainlink/new`}
          buttonText="Create New Chainlink Node"
          role={role}
        />
      )}
    </div>
  );
}
