"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DeploymentsList } from "@/components/deployments-list";
import { PolkadotNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NoResult } from "@/components/shared/no-result/no-result";
import { PolkadotNode } from "@/types";

interface PolkadotClientProps {
  data: PolkadotNode[];
  role: Roles;
}

export const PolkadotClient: React.FC<PolkadotClientProps> = ({
  data,
  role,
}) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(PolkadotNetworks, network),
    client: "Parity Polkadot",
    url: `/${params.workspaceId}/deployments/polkadot/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Polkadot Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/polkadot/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Polkadot Node
          </Button>
        )}
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/polkadot.svg"
          title="No Polkadot Nodes"
          description="Polkadot node syncs Polkadot different networks and propagates transactions to the connected peers."
          createUrl={`/${params.workspaceId}/deployments/polkadot/new`}
          buttonText="Create New Polkadot Node"
          role={role}
        />
      )}
    </>
  );
};
