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
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

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
