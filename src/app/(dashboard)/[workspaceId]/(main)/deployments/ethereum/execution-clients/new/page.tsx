import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateExecutionClientNodeForm } from "../components/create-execution-client-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

export default async function CreateNewBitcoinNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "ethereum",
    component: "executionEngine",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Execution Client Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateExecutionClientNodeForm images={component} />
      </CardContent>
    </Card>
  );
}
