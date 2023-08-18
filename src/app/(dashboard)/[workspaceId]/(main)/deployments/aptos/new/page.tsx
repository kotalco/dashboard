import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAptosNodeForm } from "../components/create-aptos-node-form";

export default async function CreateNewSecretPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Aptos Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateAptosNodeForm />
      </CardContent>
    </Card>
  );
}
