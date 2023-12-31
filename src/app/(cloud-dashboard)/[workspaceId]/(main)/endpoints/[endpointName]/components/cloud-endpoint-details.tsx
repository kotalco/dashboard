import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getEndpoint } from "@/services/get-endpoint";
import { getEndpointStats } from "@/services/get-endpoint-stats";

import { EndpointDetails } from "@/components/shared/endpoint/endpoint-details";
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

  const { stats } = await getEndpointStats(workspaceId, name);

  return (
    <>
      <EndpointDetails endpoint={endpoint} stats={stats} />

      <Suspense fallback={<DeleEndpointButtonSkeleton />}>
        <DeleteEndpointButton workspaceId={workspaceId} name={name} />
      </Suspense>
    </>
  );
};
