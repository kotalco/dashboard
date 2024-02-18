import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";

import { DangerZoneTab } from "./_components/danger-zone-tab";
import { Logs } from "@/components/logs";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configuration", value: "config" },
  { label: "Logs", value: "logs" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function BeaconNodePage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { data: peers } = await getNodes<IPFSPeer>(
    params.workspaceId,
    "/ipfs/peers"
  );
  const { data: clusterPeers } = await getNodes<IPFSClusterPeer>(
    params.workspaceId,
    "/ipfs/clusterpeers"
  );

  const { data: peer } = await getNode<IPFSClusterPeer>(
    workspaceId,
    `/ipfs/clusterpeers/${nodeName}`
  );

  if (!peer) {
    redirect(`/${workspaceId}/deployments/ipfs?tab=cluster-peers`);
  }

  if (!token) return null;
  const { name, createdAt, image } = peer;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "ipfs",
      component: "clusterPeer",
      client: "ipfs-cluster",
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
            token={value}
            component="clusterpeers"
          />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <NodeMetrics
            nodeName={name}
            protocol={Protocol.IPFS}
            token={value}
            component="clusterpeers"
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={peer}
            role={role}
            versions={versions}
            peers={peers}
            clusterPeers={clusterPeers}
          />
          <Logs
            url={`ipfs/clusterpeers/${peer.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />
          <DangerZoneTab node={peer} />
        </Tabs>
      </div>
    </div>
  );
}
