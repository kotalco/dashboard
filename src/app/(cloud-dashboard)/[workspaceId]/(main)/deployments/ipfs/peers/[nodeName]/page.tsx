import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { IPFSPeer } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";

import { IPFSPeerStats } from "./_components/ipfs-peer-stats";
import { DangerZoneTab } from "./_components/danger-zone-tab";
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

  const { data: peer } = await getNode<IPFSPeer>(
    workspaceId,
    `/ipfs/peers/${nodeName}`
  );

  if (!peer) {
    redirect(`/${workspaceId}/deployments/ipfs?tab=peers`);
  }

  if (!token) return null;
  const { name, createdAt, image } = peer;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "ipfs",
      component: "peer",
      client: "kubo",
    },
    image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={name}
            protocol={Protocol.IPFS}
            component="peers"
            token={value}
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <IPFSPeerStats
            nodeName={name}
            token={value}
            workspaceId={workspaceId}
          />
          <NodeMetrics
            nodeName={name}
            protocol={Protocol.IPFS}
            token={value}
            component="peers"
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig node={peer} role={role} versions={versions} />
          <Logs
            url={`ipfs/peers/${peer.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />
          <DangerZoneTab node={peer} />
        </Tabs>
      </div>
    </div>
  );
}
