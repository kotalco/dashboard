import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { ChainlinkNode, ExecutionClientNode } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";
import { getNodes } from "@/services/get-nodes";
import { getClientVersions } from "@/services/get-client-versions";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";

import { DangerZoneTab } from "./_components/danger-zone-tab";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configuration", value: "config" },
  { label: "Logs", value: "logs" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function ChainlinkPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { options: passwordOptions } = await getSecrets(
    workspaceId,
    SecretType.Password
  );
  const { options: tlsOptions } = await getSecrets(
    workspaceId,
    SecretType["TLS Certificate"]
  );

  const { data: executionClients } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );

  const { data: node } = await getNode<ChainlinkNode>(
    workspaceId,
    `/chainlink/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/chainlink`);
  }

  if (!token) return null;
  const { name, createdAt } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "chainlink",
      component: "node",
      client: "chainlink",
    },
    node.image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.Chainlink}
            token={value}
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <NodeMetrics
            nodeName={node.name}
            protocol={Protocol.Chainlink}
            token={token.value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={node}
            role={role}
            versions={versions}
            executionClients={executionClients}
            passwords={passwordOptions}
            tlss={tlsOptions}
          />
          <Logs
            url={`chainlink/nodes/${name}/logs?authorization=Bearer ${value}&workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
