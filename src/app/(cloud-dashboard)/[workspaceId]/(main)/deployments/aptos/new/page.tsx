import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateAptosNodeForm } from "./_components/create-aptos-node-form";

export default async function CreateNewAptosNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const workspaceData = getWorkspace(workspaceId);
  const clientVersionData = getClientVersions({
    protocol: "aptos",
    component: "node",
  });

  const [{ role }, { component }] = await Promise.all([
    workspaceData,
    clientVersionData,
  ]);

  if (role === Roles.Reader) notFound();

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
