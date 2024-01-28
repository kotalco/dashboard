import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getNode } from "@/services/get-node";
import { getWorkspace } from "@/services/get-workspace";
import { Protocol, Roles, StorageItems } from "@/enums";
import { AptosNode } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";
import { getClientVersions } from "@/services/get-client-versions";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";

import { AptosNodeStats } from "./_components/aptos-node-stats";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configurations", value: "config" },
  { label: "Logs", value: "logs" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { data: node } = await getNode<AptosNode>(
    workspaceId,
    `/aptos/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/aptos`);
  }

  if (!token) return null;
  const { name, createdAt } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "aptos",
      component: "node",
      client: "aptos-core",
      network: node.network,
    },
    node.image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.Aptos}
            token={token.value}
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <AptosNodeStats nodeName={name} token={value} />
          <NodeMetrics
            nodeName={name}
            protocol={Protocol.Aptos}
            token={value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig node={node} role={role} versions={versions} />
          <Logs
            url={`aptos/nodes/${name}/logs?authorization=Bearer ${value}&workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
