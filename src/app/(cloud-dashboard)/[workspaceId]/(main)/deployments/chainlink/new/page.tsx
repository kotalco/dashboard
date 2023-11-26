import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateChainlinkNodeForm } from "../components/create-chainlink-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles, SecretType } from "@/enums";
import { getNodes } from "@/services/get-nodes";
import { ExecutionClientNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

export const revalidate = 0;

export default async function CreateNewChainlinkNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const { data } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );
  const secrets = await getSecrets(workspaceId, SecretType.Password);

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "chainlink",
    component: "node",
    client: "chainlink",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Chainlink Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateChainlinkNodeForm
          images={versions}
          executionClients={data}
          passwords={secrets}
        />
      </CardContent>
    </Card>
  );
}
