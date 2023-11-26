import Link from "next/link";
import { Plus } from "lucide-react";

import { getWorkspace } from "@/services/get-workspace";
import { getEnumKey } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { BitcoinNetworks, Roles } from "@/enums";
import { BitcoinNode } from "@/types";

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
  const { data } = await getNodes<BitcoinNode>(workspaceId, "/bitcoin/nodes");
  const { role } = await getWorkspace(params.workspaceId);
  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(BitcoinNetworks, network),
    client: "Bitcoin Core",
    url: `/${params.workspaceId}/deployments/bitcoin/${name}`,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="Bitcoin Deployments" />

          {role !== Roles.Reader && !!data.length && (
            <Button asChild>
              <Link href={`/${params.workspaceId}/deployments/bitcoin/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Aptos Node
              </Link>
            </Button>
          )}
        </div>

        <DeploymentsList data={mainNodesInfo} />
        {!data.length && (
          <NoResult
            imageUrl="/images/bitcoin.svg"
            title="No Bitcoin Nodes"
            description="Bitcoin nodes retrieve and store data on the Bitcoin network."
            createUrl={`/${params.workspaceId}/deployments/bitcoin/new`}
            buttonText="Create New Bitcoin Node"
            role={role}
          />
        )}
      </div>
    </div>
  );
}
