import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { ExecutionClientNode } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";

import { ExecutionClientNodeStats } from "./_components/execution-client-node-stats";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { Logs } from "@/components/logs";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configuration", value: "config" },
  { label: "Logs", value: "logs" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function ExecutionClientPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { options: privateKeys } = await getSecrets(
    workspaceId,
    SecretType["Execution Client Private Key"]
  );
  const { options: jwts } = await getSecrets(
    workspaceId,
    SecretType["JWT Secret"]
  );

  const { data: node } = await getNode<ExecutionClientNode>(
    workspaceId,
    `/ethereum/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/ethereum?tab=execution-clients`);
  }

  if (!token) return null;
  const { name, createdAt, image, client } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "ethereum",
      component: "executionEngine",
      client: client,
    },
    image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.Ethereum}
            token={value}
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <ExecutionClientNodeStats
            nodeName={name}
            token={value}
            workspaceId={workspaceId}
          />
          <NodeMetrics
            nodeName={name}
            protocol={Protocol.Ethereum}
            token={value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={node}
            role={role}
            versions={versions}
            privateKeys={privateKeys}
            jwts={jwts}
          />
          <Logs
            url={`ethereum/nodes/${node.name}/logs?authorization=Bearer ${token}&workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
