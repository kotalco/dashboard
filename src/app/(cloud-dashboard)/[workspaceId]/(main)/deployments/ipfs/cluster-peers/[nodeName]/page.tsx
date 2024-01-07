import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";

import { ProtocolTab } from "./components/protocol-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { PeersTab } from "./components/peers-tab";
import { SecurityTab } from "./components/security-tab";
import { Logs } from "@/components/logs";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Peers", value: "peers" },
  { label: "Security", value: "security" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function BeaconNodePage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
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
    redirect(`/${workspaceId}/deployments/ipfs?deployment=cluster-peers`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "ipfs",
      component: "clusterPeer",
      client: "ipfs-cluster",
    },
    peer.image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          {token && (
            <NodeStatus
              nodeName={peer.name}
              protocol={Protocol.IPFS}
              token={token.value}
              component="clusterpeers"
            />
          )}
          <Heading
            title={peer.name}
            description={`Created at ${format(
              parseISO(peer.createdAt),
              "MMMM do, yyyy"
            )}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          {token && (
            <NodeMetrics
              nodeName={peer.name}
              protocol={Protocol.IPFS}
              token={token.value}
              component="clusterpeers"
            />
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={peer} role={role} versions={versions} />
          <PeersTab
            node={peer}
            role={role}
            peers={peers}
            clusterPeers={clusterPeers}
          />
          <SecurityTab node={peer} />
          <Logs
            url={`ipfs/clusterpeers/${peer.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />
          <ResourcesForm
            node={peer}
            role={role}
            url={`/ipfs/clusterpeers/${peer.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={peer} />
        </Tabs>
      </div>
    </div>
  );
}
