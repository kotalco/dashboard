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
import { BitcoinNode, ExecutionClientNode } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ResourcesForm } from "@/components/resources-form";
import { ExecutionClientNodeStats } from "./components/execution-client-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { AccessControlTab } from "./components/access-control-tab";
import { NetworkingTab } from "./components/networking-tab";
import { LogsTab } from "./components/logs-tab";

export default async function ExecutionClientPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const secrets = await getSecrets(workspaceId);
  const executionClientPrivateKeys = secrets.filter(
    ({ type }) => type === SecretType["Execution Client Private Key"]
  );
  const jwtSecrets = secrets.filter(
    ({ type }) => type === SecretType["JWT Secret"]
  );

  try {
    const node = await getNode<ExecutionClientNode>(
      workspaceId,
      `/ethereum/nodes/${nodeName}`
    );

    const { versions } = await getClientVersions(
      {
        protocol: "ethereum",
        component: "executionEngine",
        client: node.client,
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
                protocol={Protocol.ethereum}
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
                <ExecutionClientNodeStats
                  nodeName={node.name}
                  token={token.value}
                  workspaceId={workspaceId}
                />
                <NodeMetrics
                  nodeName={node.name}
                  protocol={Protocol.ethereum}
                  token={token.value}
                  workspaceId={workspaceId}
                />
              </>
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="networking">Networking</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              {node.client !== ExecutionClientClients.Nethermind && (
                <TabsTrigger value="accessControl">Access Control</TabsTrigger>
              )}
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
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="networking"
            >
              <NetworkingTab
                node={node}
                role={role}
                secrets={executionClientPrivateKeys}
              />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
              <APITab node={node} role={role} secrets={jwtSecrets} />
            </TabsContent>
            {node.client !== ExecutionClientClients.Nethermind && (
              <TabsContent
                className="px-4 py-3 sm:px-6 sm:py-4"
                value="accessControl"
              >
                <AccessControlTab node={node} role={role} />
              </TabsContent>
            )}
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
              {token && <LogsTab node={node} role={role} token={token.value} />}
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="resources"
            >
              <ResourcesForm
                node={node}
                role={role}
                updateUrl={`/ethereum/nodes/${node.name}?workspace_id=${workspaceId}`}
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
