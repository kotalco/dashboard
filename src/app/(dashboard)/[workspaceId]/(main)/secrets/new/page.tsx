import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSecretForm } from "../components/create-secret-form";

export default async function CreateNewSecretPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Secret</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateSecretForm />
      </CardContent>
    </Card>
  );
}
