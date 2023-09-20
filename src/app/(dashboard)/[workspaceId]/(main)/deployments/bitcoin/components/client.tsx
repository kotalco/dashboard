"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Roles } from "@/enums";
import { NoResult } from "@/components/no-result";
import { BitcoinNode } from "@/types";
import { DeploymentsList } from "@/components/deployments-list";

interface BitcoinClientProps {
  data: BitcoinNode[];
  role: Roles;
}

export const BitcoinClient: React.FC<BitcoinClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network,
    client: "Bitcoin Core",
    url: `/${params.workspaceId}/deployments/bitcoin/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Bitcoin Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/bitcoin/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Bitcoin Node
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
    </>
  );
};
