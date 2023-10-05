import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStacksNodeForm } from "../components/create-stacks-node-form";
import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { getNodes } from "@/services/get-nodes";
import { BitcoinNode } from "@/types";

export default async function CreateNewPolkadotPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const { data } = await getNodes<BitcoinNode>(workspaceId, "/bitcoin/nodes");

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "stacks",
    component: "node",
    client: "stacks-node",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Stacks Node</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateStacksNodeForm images={versions} bitcoinNodes={data} />
      </CardContent>
    </Card>
  );
}
