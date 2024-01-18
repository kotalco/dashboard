"use client";

import { useParams } from "next/navigation";

import { NoResult } from "@/components/shared/no-result/no-result";
import { DeploymentsList } from "@/components/deployments-list";
import { ValidatorNode } from "@/types";
import { Roles, ValidatorClients, ValidatorNetworks } from "@/enums";
import { getEnumKey } from "@/lib/utils";

interface ValidatorClientProps {
  data: ValidatorNode[];
  role: Roles;
}

export const ValidatorClient: React.FC<ValidatorClientProps> = ({
  data,
  role,
}) => {
  const params = useParams();

  const mainNodesInfo = data.map(({ name, network, client }) => ({
    name,
    network: getEnumKey(ValidatorNetworks, network),
    client: getEnumKey(ValidatorClients, client),
    url: `/${params.workspaceId}/deployments/ethereum/validators/${name}`,
  }));

  return (
    <>
      <DeploymentsList data={mainNodesInfo} />
      {!data.length && (
        <NoResult
          imageUrl="/images/ethereum2.svg"
          title="No Validator Nodes"
          description="Validator produces blocks, which contain consensus information about shards across the network, and votes on the validity of blocks that have already been produced."
          createUrl={`/${params.workspaceId}/deployments/ethereum/validators/new`}
          buttonText="Create New Validator Node"
          role={role}
        />
      )}
    </>
  );
};
