import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBeaconNodeForm } from "../components/create-beacon-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { ExecutionClientNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

export default async function CreateNewBeaconNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const secrets = await getSecrets(workspaceId, SecretType["JWT Secret"]);
  const { data } = await getNodes<ExecutionClientNode>(
    params.workspaceId,
    "/ethereum/nodes"
  );

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "ethereum",
    component: "beaconNode",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Beacon Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateBeaconNodeForm
          images={component}
          executionClients={data}
          secrets={secrets}
        />
      </CardContent>
    </Card>
  );
}
