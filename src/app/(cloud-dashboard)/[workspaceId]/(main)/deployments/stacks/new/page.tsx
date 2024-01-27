import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { getNodes } from "@/services/get-nodes";
import { BitcoinNode } from "@/types";

import { Heading } from "@/components/ui/heading";

import { CreateStacksNodeForm } from "./_components/create-stacks-node-form";

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
    <div className="space-y-8">
      <Heading title="New Stacks Node" />
      <CreateStacksNodeForm images={versions} bitcoinNodes={data} />
    </div>
  );
}
