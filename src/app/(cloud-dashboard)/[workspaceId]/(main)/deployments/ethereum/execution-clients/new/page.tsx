import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";

import { Heading } from "@/components/ui/heading";

import { CreateExecutionClientNodeForm } from "./_components/create-execution-client-node-form";

export default async function CreateNewExecutionClientNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "ethereum",
    component: "executionEngine",
  });

  return (
    <div className="space-y-8">
      <Heading title="New Execution Client Node" />
      <CreateExecutionClientNodeForm images={component} />
    </div>
  );
}
