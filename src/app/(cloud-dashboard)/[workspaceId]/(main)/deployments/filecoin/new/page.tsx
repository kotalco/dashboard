import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNewFilecoinNode } from "../_components/create-filecoin-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

export default async function CreateNewFilecoinNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "filecoin",
    component: "node",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Filecoin Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateNewFilecoinNode images={component} />
      </CardContent>
    </Card>
  );
}
