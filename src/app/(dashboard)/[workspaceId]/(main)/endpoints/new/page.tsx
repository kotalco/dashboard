import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEndpointForm } from "../components/create-endpoint-form";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { getDomainInfo } from "@/services/get-domain-info";
import { getServices } from "@/services/get-services";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function CreateNewAptosNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { name } = await getDomainInfo();
  const { services } = await getServices(workspaceId);
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Endpoint</CardTitle>
      </CardHeader>
      <CardContent>
        {!name && (
          <Alert variant="info">
            <AlertDescription>
              Your domain is not configured yet. Click{" "}
              <Link
                className="text-primary hover:underline underline-offset-4"
                href={`/${workspaceId}/domain`}
              >
                here
              </Link>{" "}
              to set your custom domain
            </AlertDescription>
          </Alert>
        )}

        {name && <CreateEndpointForm services={services} />}
      </CardContent>
    </Card>
  );
}
