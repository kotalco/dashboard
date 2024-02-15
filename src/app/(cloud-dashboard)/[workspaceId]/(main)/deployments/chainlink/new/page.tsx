import { notFound } from "next/navigation";

import { getClientVersions } from "@/services/get-client-versions";
import { getWorkspace } from "@/services/get-workspace";
import { Roles, SecretType } from "@/enums";
import { getNodes } from "@/services/get-nodes";
import { ExecutionClientNode } from "@/types";
import { getSecrets } from "@/services/get-secrets";

import { Heading } from "@/components/ui/heading";

import { CreateChainlinkNodeForm } from "./_components/create-chainlink-node-form";

export default async function CreateNewChainlinkNodePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;
  const workspaceData = getWorkspace(workspaceId);
  const clientVersionData = getClientVersions({
    protocol: "chainlink",
    component: "node",
    client: "chainlink",
  });
  const executionClientData = getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );
  const secretsData = getSecrets(workspaceId, SecretType.Password);
  const [{ role }, { versions }, { data }, { options }] = await Promise.all([
    workspaceData,
    clientVersionData,
    executionClientData,
    secretsData,
  ]);

  if (role === Roles.Reader) notFound();

  return (
    <div className="space-y-8">
      <Heading title="New Chainlink Node" />
      <CreateChainlinkNodeForm
        images={versions}
        executionClients={data}
        passwords={options}
      />
    </div>
  );
}
