import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { FilecoinNode, IPFSPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";

import { DangerZoneTab } from "./_components/danger-zone-tab";
import { NodeConfig } from "./_components/node-config";
import { Logs } from "@/components/logs";

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

  const { data: peers } = await getNodes<IPFSPeer>(workspaceId, "/ipfs/peers");

  const { data: node } = await getNode<FilecoinNode>(
    workspaceId,
    `/filecoin/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/filecoin`);
  }

  if (!token) return null;
  const { name, createdAt, network, image } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "filecoin",
      component: "node",
      client: "lotus",
      network: network,
    },
    image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.Filecoin}
            token={value}
          />
          <Heading
            title={node.name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <NodeMetrics
            nodeName={name}
            protocol={Protocol.Filecoin}
            token={value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={node}
            role={role}
            versions={versions}
            peers={peers}
          />
          <Logs
            url={`filecoin/nodes/${name}/logs?authorization=Bearer ${value}&workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
