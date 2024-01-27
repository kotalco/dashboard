import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePolkadotNodeForm } from "../_components/create-polkadot-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

export default async function CreateNewPolkadotPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "polkadot",
    component: "node",
    client: "polkadot",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Polkadot Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreatePolkadotNodeForm images={versions} />
      </CardContent>
    </Card>
  );
}
