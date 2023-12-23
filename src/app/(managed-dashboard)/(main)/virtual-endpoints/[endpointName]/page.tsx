import { VirtualEndpointDetails } from "./_components/virtual-endpoint-details";

export default async function EndpointPage({
  params,
}: {
  params: { endpointName: string };
}) {
  const { endpointName } = params;

  return (
    <div className="flex-col">
      <VirtualEndpointDetails name={endpointName} />
    </div>
  );
}
