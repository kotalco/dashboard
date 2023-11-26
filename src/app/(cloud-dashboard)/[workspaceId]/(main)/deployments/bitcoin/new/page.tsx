import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBitcoinNodeForm } from "../components/create-bitcoin-node-form";
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

  const { versions } = await getClientVersions({
    protocol: "bitcoin",
    component: "node",
    client: "bitcoin-core",
  });

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
