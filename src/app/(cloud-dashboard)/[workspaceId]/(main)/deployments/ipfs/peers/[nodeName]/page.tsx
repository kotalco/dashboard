import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { IPFSPeer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { IPFSPeerStats } from "./components/ipfs-peer-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { RoutingTab } from "./components/routing-tab";
import { ConfigrationProfilesTab } from "./components/configration-profiles-tab";
import { Logs } from "@/components/logs";

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
        <Tabs defaultValue="protocol">
          <TabsList>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="configrationProfiles">
              Configration Profiles
            </TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {role === Roles.Admin && (
              <TabsTrigger
                value="danger"
                className="text-destructive data-[state=active]:text-destructive data-[state=active]:bg-destructive/10"
              >
                Danger Zone
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="protocol">
            <ProtocolTab node={peer} role={role} versions={versions} />
          </TabsContent>
          <TabsContent
            className="px-4 py-3 sm:px-6 sm:py-4"
            value="configrationProfiles"
          >
            <ConfigrationProfilesTab node={peer} role={role} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
            <APITab node={peer} role={role} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="routing">
            <RoutingTab node={peer} role={role} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
            {token && (
              <Logs
                url={`ipfs/peers/${peer.name}/logs?authorization=Bearer ${token.value}&workspace_id=${params.workspaceId}`}
              />
            )}
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="resources">
            <ResourcesForm
              node={peer}
              role={role}
              url={`/ipfs/peers/${peer.name}?workspace_id=${workspaceId}`}
            />
          </TabsContent>
          {role === Roles.Admin && (
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="danger">
              <DangerZoneTab node={peer} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
