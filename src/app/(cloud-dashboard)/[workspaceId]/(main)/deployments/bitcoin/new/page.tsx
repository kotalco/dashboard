import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateBitcoinNodeForm } from "./_components/create-bitcoin-node-form";

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
    <div className="space-y-8">
      <Heading title="New Bitcoin Node" />
      <CreateBitcoinNodeForm images={versions} />
    </div>
  );
}
