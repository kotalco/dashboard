import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getVirtualEndpoint } from "@/services/get-virtual-endpoint";

import { DeleteEndpoint } from "@/components/shared/endpoint/delete-endpoint";
import { EndpointDetails } from "@/components/shared/endpoint/endpoint-details";
import { EndpointStatsSkeleton } from "@/components/skeletons/endpoint-stats-skeleton";

import { VirtualEndpointStats } from "./virtual-endpoint-stats";

interface VirtualEndpointDetailsProps {
  name: string;
}

export const VirtualEndpointDetails = async ({
  name,
}: VirtualEndpointDetailsProps) => {
  const { endpoint } = await getVirtualEndpoint(name);

  if (!endpoint) notFound();

  return (
    <>
      <EndpointDetails endpoint={endpoint}>
        <Suspense fallback={<EndpointStatsSkeleton />}>
          <VirtualEndpointStats name={name} />
        </Suspense>
      </EndpointDetails>

      <DeleteEndpoint name={endpoint.name} />
    </>
  );
};
