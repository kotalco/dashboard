import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreatePolkadotNodeForm } from "./_components/create-polkadot-node-form";

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
    <div className="space-y-8">
      <Heading title="New Polkadot Node" />
      <CreatePolkadotNodeForm images={versions} />
    </div>
  );
}
