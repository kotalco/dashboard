import { getProtocols } from "@/services/get-protocols";
import { Heading } from "@/components/ui/heading";

import { CreateEndpointForm } from "./_components/create-endpoint-form";

export default async function CreateNewAptosNodePage() {
  const { protocols } = await getProtocols();

  return (
    <div className="space-y-8">
      <Heading title="New Endpoint" />
      <CreateEndpointForm services={protocols} />
    </div>
  );
}
