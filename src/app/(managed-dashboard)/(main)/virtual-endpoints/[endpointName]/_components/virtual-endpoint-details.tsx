import { notFound } from "next/navigation";

import { getVirtualEndpoint } from "@/services/get-virtual-endpoint";
import { getVirtualEndpointStats } from "@/services/get-virtual-endpoint-stats";

import { DeleteEndpoint } from "@/components/shared/endpoint/delete-endpoint";
import { EndpointDetails } from "@/components/shared/endpoint/endpoint-details";

interface VirtualEndpointDetailsProps {
  name: string;
}

export const VirtualEndpointDetails = async ({
  name,
}: VirtualEndpointDetailsProps) => {
  const { endpoint } = await getVirtualEndpoint(name);

  if (!endpoint) notFound();

  const { stats } = await getVirtualEndpointStats(name);

  return (
    <>
      <EndpointDetails endpoint={endpoint} stats={stats} />

      <DeleteEndpoint
        name={endpoint.name}
        url={`/virtual-endpoints/${name}`}
        redirectUrl={`/virtual-endpoints`}
      />
    </>
  );
};
