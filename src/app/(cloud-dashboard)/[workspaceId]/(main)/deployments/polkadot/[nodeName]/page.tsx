import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { PolkadotNode } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";

import { PolkadotNodeStats } from "./_components/polkadot-node-stats";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { Logs } from "@/components/logs";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configurations", value: "config" },
  { label: "Logs", value: "logs" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function PolkadotPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { options: privateKeys } = await getSecrets(
    workspaceId,
    SecretType["Polkadot Private Key"]
  );

  const { data: node } = await getNode<PolkadotNode>(
    workspaceId,
    `/polkadot/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/polkadot`);
  }

  if (!token) return null;
  const { name, createdAt, image } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "polkadot",
      component: "node",
      client: "polkadot",
    },
    image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.Polkadot}
            token={value}
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <PolkadotNodeStats
            nodeName={node.name}
            token={token.value}
            workspaceId={workspaceId}
          />
          <NodeMetrics
            nodeName={node.name}
            protocol={Protocol.Polkadot}
            token={token.value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={node}
            role={role}
            versions={versions}
            privateKeys={privateKeys}
          />
          <Logs
            url={`polkadot/nodes/${name}/logs?authorization=Bearer ${value}&workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
