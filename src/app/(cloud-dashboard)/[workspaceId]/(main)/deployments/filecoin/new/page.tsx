import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateNewFilecoinNode } from "./_components/create-filecoin-node-form";

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
    <div className="space-y-8">
      <Heading title="New Filecoin Node" />
      <CreateNewFilecoinNode images={component} />
    </div>
  );
}
