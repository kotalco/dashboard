"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DeploymentsList } from "@/components/deployments-list";
import { Roles, StacksNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NoResult } from "@/components/shared/no-result/no-result";
import { StacksNode } from "@/types";

interface StacksClientProps {
  data: StacksNode[];
  role: Roles;
}

export const StacksClient: React.FC<StacksClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(StacksNetworks, network),
    client: "Stacks",
    url: `/${params.workspaceId}/deployments/stacks/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Stacks Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/stacks/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Stacks Node
          </Button>
        )}
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/stacks.svg"
          title="No Stacks Nodes"
          description="Stacks node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
          createUrl={`/${params.workspaceId}/deployments/stacks/new`}
          buttonText="Create New Stacks Node"
          role={role}
        />
      )}
    </>
  );
};
