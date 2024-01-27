import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { getDomainInfo } from "@/services/get-domain-info";
import { getServices } from "@/services/get-services";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heading } from "@/components/ui/heading";

import { CreateEndpointForm } from "./_components/create-endpoint-form";

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
    <div className="space-y-8">
      <Heading title="New Endpoint" />
      {!name && (
        <Alert className="alert-info">
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
    </div>
  );
}
