import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { Roles, SecretType } from "@/enums";
import { ExecutionClientNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

import { Heading } from "@/components/ui/heading";

import { CreateBeaconNodeForm } from "./_components/create-beacon-node-form";

export default async function CreateNewBeaconNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options } = await getSecrets(workspaceId, SecretType["JWT Secret"]);
  const { data } = await getNodes<ExecutionClientNode>(
    params.workspaceId,
    "/ethereum/nodes"
  );

  if (role === Roles.Reader) notFound();

  const { component } = await getClientVersions({
    protocol: "ethereum",
    component: "beaconNode",
  });

  return (
    <div className="space-y-8">
      <Heading title="New Beacon Node" />
      <CreateBeaconNodeForm
        images={component}
        executionClients={data}
        secrets={options}
      />
    </div>
  );
}
