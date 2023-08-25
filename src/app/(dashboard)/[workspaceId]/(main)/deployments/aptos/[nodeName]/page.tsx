import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getAptosNode } from "@/services/get-aptos.node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, StorageItems } from "@/enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { AptosNodeStats } from "./components/aptos-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";

export default async function SecretsPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);

  try {
    const node = await getAptosNode(workspaceId, nodeName);

    return (
      <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
          <div className="flex items-start gap-x-2">
            {token && (
              <NodeStatus
                nodeName={node.name}
                protocol={Protocol.aptos}
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
              <>
                <AptosNodeStats
                  nodeName={node.name}
                  token={token.value}
                  workspaceId={workspaceId}
                />
                <NodeMetrics
                  nodeName={node.name}
                  protocol={Protocol.aptos}
                  token={token.value}
                  workspaceId={workspaceId}
                />
              </>
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger
                value="danger"
                className="text-destructive data-[state=active]:text-destructive data-[state=active]:bg-destructive/10"
              >
                Danger Zone
              </TabsTrigger>
            </TabsList>
            <TabsContent value="protocol">
              <ProtocolTab node={node} role={role} />
            </TabsContent>
            <TabsContent value="api">
              <APITab node={node} role={role} />
            </TabsContent>
            <TabsContent value="logs">Logs</TabsContent>
            <TabsContent value="resources">Resources</TabsContent>
            <TabsContent value="danger">Danger Zone</TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
