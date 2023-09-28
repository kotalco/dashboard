"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DeploymentsList } from "@/components/deployments-list";
import { ChainlinkNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NoResult } from "@/components/no-result";
import { ChainlinkNode } from "@/types";

interface ChainlinkClientProps {
  data: ChainlinkNode[];
  role: Roles;
}

export const ChainlinkClient: React.FC<ChainlinkClientProps> = ({
  data,
  role,
}) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(
    ({ name, ethereumChainId, linkContractAddress }) => ({
      name,
      network: getEnumKey(
        ChainlinkNetworks,
        `${ethereumChainId}:${linkContractAddress}`
      ),
      client: "Chainlink",
      url: `/${params.workspaceId}/deployments/chainlink/${name}`,
    })
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Chainlink Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/chainlink/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Chainlink Node
          </Button>
        )}
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/chainlink.svg"
          title="No Chainlink Nodes"
          description="Chainlink node connects smart contracts with external data using a decentralized oracle network."
          createUrl={`/${params.workspaceId}/deployments/chainlink/new`}
          buttonText="Create New Chainlink Node"
          role={role}
        />
      )}
    </>
  );
};
