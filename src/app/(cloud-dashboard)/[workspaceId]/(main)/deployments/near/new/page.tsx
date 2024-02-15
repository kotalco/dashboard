import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateNEARNodeForm } from "./_components/create-near-node-form";

export default async function CreateNewBitcoinNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { versions } = await getClientVersions({
    protocol: "near",
    component: "node",
    client: "nearcore",
  });

  return (
    <div className="space-y-8">
      <Heading title="New NEAR Node" />
      <CreateNEARNodeForm images={versions} />
    </div>
  );
}
