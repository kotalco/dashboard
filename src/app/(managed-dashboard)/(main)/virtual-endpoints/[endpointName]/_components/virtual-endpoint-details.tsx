import Image from "next/image";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";

import { getVirtualEndpoint } from "@/services/get-virtual-endpoint";

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

  return (
    <>
      <EndpointDetails endpoint={endpoint} />

      <DeleteEndpoint name={endpoint.name} />
    </>
  );
};
