"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getEnumKey } from "@/lib/utils";
import { AptosNetworks, Roles } from "@/enums";
import { NoResult } from "@/components/no-result";
import { AptosNode } from "@/types";
import { DeploymentsList } from "@/components/deployments-list";

interface AptosClientProps {
  data: AptosNode[];
  role: Roles;
}

export const AptosClient: React.FC<AptosClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(AptosNetworks, network),
    client: "aptos-core",
    url: `/${params.workspaceId}/deployments/aptos/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Aptos Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/aptos/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Aptos Node
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
    </>
  );
};
