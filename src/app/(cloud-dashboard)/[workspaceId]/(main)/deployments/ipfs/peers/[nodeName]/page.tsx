import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { IPFSPeer } from "@/types";
import { getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { Logs } from "@/components/logs";

import { IPFSPeerStats } from "./components/ipfs-peer-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { RoutingTab } from "./components/routing-tab";
import { ConfigrationProfilesTab } from "./components/configration-profiles-tab";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Configration Profiles", value: "configrationProfiles" },
  { label: "API", value: "api" },
  { label: "Routing", value: "routing" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function ExecutionClientPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);

  const { data: peer } = await getNode<IPFSPeer>(
    workspaceId,
    `/ipfs/peers/${nodeName}`
  );

  if (!peer) {
    redirect(`/${workspaceId}/deployments/ipfs?deployment=peers`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "ipfs",
      component: "peer",
      client: "kubo",
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
              component="peers"
              token={token.value}
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
            <>
              <IPFSPeerStats
                nodeName={peer.name}
                token={token.value}
                workspaceId={workspaceId}
              />
              <NodeMetrics
                nodeName={peer.name}
                protocol={Protocol.IPFS}
                token={token.value}
                component="peers"
              />
            </>
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={peer} role={role} versions={versions} />
          <ConfigrationProfilesTab node={peer} role={role} />
          <APITab node={peer} role={role} />
          <RoutingTab node={peer} role={role} />
          <Logs
            url={`ipfs/peers/${peer.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />
          <ResourcesForm
            node={peer}
            role={role}
            url={`/ipfs/peers/${peer.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={peer} />
        </Tabs>
      </div>
    </div>
  );
}
