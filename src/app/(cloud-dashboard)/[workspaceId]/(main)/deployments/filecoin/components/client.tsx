"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { getEnumKey } from "@/lib/utils";
import { AptosNetworks, FilecoinNetworks, Roles } from "@/enums";
import { NoResult } from "@/components/no-result";
import { FilecoinNode } from "@/types";
import { DeploymentsList } from "@/components/deployments-list";

interface FilecoinClientProps {
  data: FilecoinNode[];
  role: Roles;
}

export const FilecoinClient: React.FC<FilecoinClientProps> = ({
  data,
  role,
}) => {
  const router = useRouter();
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network }) => ({
    name,
    network: getEnumKey(FilecoinNetworks, network),
    client: "Lotus",
    url: `/${params.workspaceId}/deployments/filecoin/${name}`,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Filecoin Deployments" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() =>
              router.push(`/${params.workspaceId}/deployments/filecoin/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Filecoin Node
          </Button>
        )}
      </div>

      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/filecoin.svg"
          title="No Filecoin Nodes"
          description="Filecoin nodes retrieve and store data on the Filecoin network."
          createUrl={`/${params.workspaceId}/deployments/filecoin/new`}
          buttonText="Create New Filecoin Node"
          role={role}
        />
      )}
    </>
  );
};
