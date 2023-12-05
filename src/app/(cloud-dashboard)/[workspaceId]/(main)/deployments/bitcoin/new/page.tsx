import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBitcoinNodeForm } from "./_components/create-bitcoin-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

export default async function CreateNewBitcoinNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const workspaceData = getWorkspace(workspaceId);
  const clientVersionData = getClientVersions({
    protocol: "bitcoin",
    component: "node",
    client: "bitcoin-core",
  });

  const [{ role }, { versions }] = await Promise.all([
    workspaceData,
    clientVersionData,
  ]);

  if (role === Roles.Reader) notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Bitcoin Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateBitcoinNodeForm images={versions} />
      </CardContent>
    </Card>
  );
}
