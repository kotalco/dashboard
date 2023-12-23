import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getEndpoint } from "@/services/get-endpoint";

import { EndpointDetails } from "@/components/shared/endpoint/endpoint-details";
import { EndpointStatsSkeleton } from "@/components/skeletons/endpoint-stats-skeleton";
import { DeleEndpointButtonSkeleton } from "@/components/skeletons/delete-endpoint-button-skeleton";

import { DeleteEndpointButton } from "./delete-endpoint-button";

interface CloudEndpointDetailsProps {
  workspaceId: string;
  name: string;
}

export const CloudEndpointDetails = async ({
  name,
  workspaceId,
}: CloudEndpointDetailsProps) => {
  const { endpoint } = await getEndpoint(workspaceId, name);

  if (!endpoint) {
    redirect(`/${workspaceId}/endpoints`);
  }

  return (
    <>
      <EndpointDetails endpoint={endpoint}>
        <Suspense fallback={<EndpointStatsSkeleton />}>
          {/* <CloudEndpointStats name={name} workspaceId={workspaceId} /> */}
        </Suspense>
      </EndpointDetails>

      <Suspense fallback={<DeleEndpointButtonSkeleton />}>
        <DeleteEndpointButton workspaceId={workspaceId} name={name} />
      </Suspense>
    </>
  );
};
