import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEndpointForm } from "../_components/create-endpoint-form";
import { getProtocols } from "@/services/get-protocols";

export default async function CreateNewAptosNodePage() {
  const { protocols } = await getProtocols();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Endpoint</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateEndpointForm services={protocols} />
      </CardContent>
    </Card>
  );
}
