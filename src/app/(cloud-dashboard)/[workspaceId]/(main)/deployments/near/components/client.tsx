"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DeploymentsList } from "@/components/deployments-list";
import { NEARNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { NoResult } from "@/components/shared/no-result/no-result";
import { NEARNode } from "@/types";

interface NEARClientProps {
  data: NEARNode[];
  role: Roles;
}

export const NEARClient: React.FC<NEARClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(NEARNetworks, network),
    client: "Near Core",
    url: `/${params.workspaceId}/deployments/near/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="NEAR Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/near/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New NEAR Node
          </Button>
        )}
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/near.svg"
          title="No NEAR Nodes"
          description="NEAR node syncs NEAR Blockchain network, and propagates transactions to the connected peers."
          createUrl={`/${params.workspaceId}/deployments/near/new`}
          buttonText="Create New NEAR Node"
          role={role}
        />
      )}
    </>
  );
};
