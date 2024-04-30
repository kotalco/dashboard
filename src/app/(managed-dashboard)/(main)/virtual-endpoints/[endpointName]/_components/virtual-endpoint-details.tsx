import { notFound } from "next/navigation";

import { getVirtualEndpoint } from "@/services/get-virtual-endpoint";
import { getVirtualEndpointStats } from "@/services/get-virtual-endpoint-stats";

import { DeleteEndpoint } from "@/components/shared/endpoint/delete-endpoint";
import { EndpointDetails } from "@/components/shared/endpoint/endpoint-details";

interface VirtualEndpointDetailsProps {
  name: string;
  filter?: "last_month" | "last_week";
}

export const VirtualEndpointDetails = async ({
  name,
  filter = "last_month",
}: VirtualEndpointDetailsProps) => {
  const { endpoint } = await getVirtualEndpoint(name);

  if (!endpoint) notFound();

  const { stats } = await getVirtualEndpointStats(name, filter);

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
