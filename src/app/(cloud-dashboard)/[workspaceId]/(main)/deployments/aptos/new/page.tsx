import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateAptosNodeForm } from "./_components/create-aptos-node-form";

export default async function CreateNewAptosNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const workspaceData = getWorkspace(workspaceId);
  const clientVersionData = getClientVersions({
    protocol: "aptos",
    component: "node",
  });

  const [{ role }, { component }] = await Promise.all([
    workspaceData,
    clientVersionData,
  ]);

  if (role === Roles.Reader) notFound();

  return (
    <div className="space-y-8">
      <Heading title="New Aptos Node" />
      <CreateAptosNodeForm images={component} />
    </div>
  );
}
