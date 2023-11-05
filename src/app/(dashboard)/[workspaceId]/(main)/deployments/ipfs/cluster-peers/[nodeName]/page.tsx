import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import {
  ExecutionClientClients,
  Protocol,
  Roles,
  SecretType,
  StorageItems,
} from "@/enums";
import {
  BeaconNode,
  ExecutionClientNode,
  IPFSClusterPeer,
  IPFSPeer,
} from "@/types";
import { getNodes } from "@/services/get-nodes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolTab } from "./components/protocol-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { PeersTab } from "./components/peers-tab";
import { SecurityTab } from "./components/security-tab";
import { Logs } from "@/components/logs";

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

  try {
    const node = await getNode<IPFSClusterPeer>(
      workspaceId,
      `/ipfs/clusterpeers/${nodeName}`
    );

    const { versions } = await getClientVersions(
      {
        protocol: "ipfs",
        component: "clusterPeer",
        client: "ipfs-cluster",
      },
      node.image
    );

    return (
      <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
          <div className="flex items-start gap-x-2">
            {token && (
              <NodeStatus
                nodeName={node.name}
                protocol={Protocol.IPFS}
                token={token.value}
                workspaceId={workspaceId}
                component="clusterpeers"
              />
            )}
            <Heading
              title={node.name}
              description={`Created at ${format(
                parseISO(node.createdAt),
                "MMMM do, yyyy"
              )}`}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
            {token && (
              <NodeMetrics
                nodeName={node.name}
                protocol={Protocol.IPFS}
                token={token.value}
                workspaceId={workspaceId}
                component="clusterpeers"
              />
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="peers">Peers</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
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
              <ProtocolTab node={node} role={role} versions={versions} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="peers">
              <PeersTab
                node={node}
                role={role}
                peers={peers}
                clusterPeers={clusterPeers}
              />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="security">
              <SecurityTab node={node} />
            </TabsContent>

            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
              {token && (
                <Logs
                  url={`ipfs/clusterpeers/${node.name}/logs?authorization=Bearer ${token.value}&workspace_id=${params.workspaceId}`}
                />
              )}
            </TabsContent>

            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="resources"
            >
              <ResourcesForm
                node={node}
                role={role}
                updateUrl={`/ipfs/clusterpeers/${node.name}?workspace_id=${workspaceId}`}
              />
            </TabsContent>
            {role === Roles.Admin && (
              <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="danger">
                <DangerZoneTab node={node} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
