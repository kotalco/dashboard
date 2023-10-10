import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { AptosNode, FilecoinNode, IPFSPeer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { IPFSTab } from "./components/ipfs-tab";
import { getNodes } from "@/services/get-nodes";
import { LogsTab } from "./components/logs-tab";

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { data } = await getNodes<IPFSPeer>(workspaceId, "/ipfs/peers");

  try {
    const node = await getNode<FilecoinNode>(
      workspaceId,
      `/filecoin/nodes/${nodeName}`
    );
    const { versions } = await getClientVersions(
      {
        protocol: "filecoin",
        component: "node",
        client: "lotus",
        network: node.network,
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
                protocol={Protocol.filecoin}
                token={token.value}
                workspaceId={workspaceId}
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
                protocol={Protocol.filecoin}
                token={token.value}
                workspaceId={workspaceId}
              />
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="ipfs">IPFS</TabsTrigger>
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
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
              <APITab node={node} role={role} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="ipfs">
              <IPFSTab node={node} role={role} peers={data} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
              <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
                {token && (
                  <LogsTab node={node} role={role} token={token.value} />
                )}
              </TabsContent>
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="resources"
            >
              <ResourcesForm
                node={node}
                role={role}
                updateUrl={`/filecoin/nodes/${node.name}?workspace_id=${workspaceId}`}
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
