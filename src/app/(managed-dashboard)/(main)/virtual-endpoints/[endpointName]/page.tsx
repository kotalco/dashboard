import { Suspense } from "react";

import { EndpointDetailsSkeleton } from "@/components/skeletons/endpoint-details-skeleton";
import { VirtualEndpointDetails } from "./_components/virtual-endpoint-details";

export default async function EndpointPage({
  params,
  searchParams,
}: {
  params: { endpointName: string };
  searchParams: { filter?: "last_month" | "last_week" };
}) {
  const { endpointName } = params;

  return (
    <div className="flex-col">
      <Suspense fallback={<EndpointDetailsSkeleton />}>
        <VirtualEndpointDetails
          name={endpointName}
          filter={searchParams.filter}
        />
      </Suspense>
    </div>
  );
}
