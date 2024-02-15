import { Suspense } from "react";

import { getEndpoints } from "@/services/get-endpoints";
import { getEnumKey } from "@/lib/utils";
import { Networks, Protocol } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateEndpointButton } from "./create-endpoint-button";

interface EndpointsListProps {
  workspaceId: string;
}

export const EndpointsList = async ({ workspaceId }: EndpointsListProps) => {
  const { data } = await getEndpoints(workspaceId);

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/endpoint.svg"
        title="No Endpoints"
        description="Endpoints are secure routes that allow developers to call your deployed nodes' APIs."
        createUrl={`/${workspaceId}/endpoints/new`}
        buttonText="New Endpoint"
        workspaceId={workspaceId}
      />
    );
  }

  const mainEndpointsInfo = data.map(
    ({ protocol, name, created_at, network }) => ({
      name,
      network: getEnumKey(Networks, network),
      protocol: getEnumKey(Protocol, protocol),
      createdAt: created_at,
      url: `/${workspaceId}/endpoints/${name}`,
    })
  );

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateEndpointButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <DeploymentsList data={mainEndpointsInfo} />
    </>
  );
};
