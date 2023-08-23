import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getAptosNode } from "@/services/get-aptos.node";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { Protocol, StorageItems } from "@/enums";

export default async function SecretsPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const node = await getAptosNode(workspaceId, nodeName);
  const { role } = await getWorkspace(workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          {token && (
            <NodeStatus
              nodeName={node.name}
              protocol={Protocol.aptos}
              token={token?.value}
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
        <Tabs defaultValue="protocol" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          <TabsContent value="protocol">Protocol</TabsContent>
          <TabsContent value="api">API</TabsContent>
          <TabsContent value="logs">Logs</TabsContent>
          <TabsContent value="resources">Resources</TabsContent>
          <TabsContent value="danger">Danger Zone</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
