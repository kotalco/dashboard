"use client";

import { useParams } from "next/navigation";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { ExecutionClientNode } from "@/types";
import {
  ExecutionClientClients,
  ExecutionClientNetworks,
  Roles,
} from "@/enums";
import { getEnumKey } from "@/lib/utils";

interface ExecutionClientClientProps {
  data: ExecutionClientNode[];
  role: Roles;
}

export const ExecutionClientClient: React.FC<ExecutionClientClientProps> = ({
  data,
  role,
}) => {
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network, client }) => ({
    name,
    network: getEnumKey(ExecutionClientNetworks, network),
    client: getEnumKey(ExecutionClientClients, client),
    url: `/${params.workspaceId}/deployments/ethereum/execution-clients/${name}`,
  }));

  return (
    <>
      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/ethereum.svg"
          title="No Execution Client Nodes"
          description="Execution client node listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state."
          createUrl={`/${params.workspaceId}/deployments/ethereum/execution-clients/new`}
          buttonText="Create New Execution Client Node"
          role={role}
        />
      )}
    </>
  );
};
