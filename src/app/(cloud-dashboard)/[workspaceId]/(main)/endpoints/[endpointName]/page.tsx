import { Suspense } from "react";

import { EndpointDetailsSkeleton } from "@/components/skeletons/endpoint-details-skeleton";

import { CloudEndpointDetails } from "./components/cloud-endpoint-details";

export default async function EndpointPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string; endpointName: string };
  searchParams: { filter?: "last_month" | "last_week" };
}) {
  const { workspaceId, endpointName } = params;

  return (
    <div className="flex-col">
      <Suspense fallback={<EndpointDetailsSkeleton />}>
        <CloudEndpointDetails
          name={endpointName}
          workspaceId={workspaceId}
          filter={searchParams.filter}
        />
      </Suspense>
    </div>
  );
}
