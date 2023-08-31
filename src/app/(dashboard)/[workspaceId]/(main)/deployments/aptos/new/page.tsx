import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAptosNodeForm } from "../components/create-aptos-node-form";
import { getClientVersions } from "@/services/get-client-versions";

export default async function CreateNewSecretPage() {
  const { component } = await getClientVersions({
    protocol: "aptos",
    component: "node",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Aptos Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateAptosNodeForm images={component} />
      </CardContent>
    </Card>
  );
}
