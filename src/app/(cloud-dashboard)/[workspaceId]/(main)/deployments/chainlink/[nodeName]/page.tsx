import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { ChainlinkNode, ExecutionClientNode } from "@/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolSkeleton } from "@/components/skeletons/protocol-skeleton";

import { ProtocolTab } from "./_components/protocol-tab";
import { APITab } from "./_components/api-tab";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { WalletTab } from "./_components/wallet-tab";
import { DatabaseTab } from "./_components/database-tab";
import { ExecutionClientTab } from "./_components/execution-client-tab";
import { getNodes } from "@/services/get-nodes";
import { TLSTab } from "./_components/tls-tab";
import { AccessControlTab } from "./_components/access-control-tab";
import { LogsTab } from "./_components/logs-tab";
import { Suspense } from "react";

export default async function ChainlinkPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options: passwordOptions } = await getSecrets(
    workspaceId,
    SecretType.Password
  );
  const { options: tlsOptions } = await getSecrets(
    workspaceId,
    SecretType["TLS Certificate"]
  );

  const { data } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );

  const { data: node } = await getNode<ChainlinkNode>(
    workspaceId,
    `/chainlink/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/chainlink`);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          {token && (
            <NodeStatus
              nodeName={node.name}
              protocol={Protocol.Chainlink}
              token={token.value}
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
              protocol={Protocol.Chainlink}
              token={token.value}
            />
          )}
        </div>
        <Tabs defaultValue="protocol">
          <TabsList>
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="executionClient">Execution Client</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="tls">TLS</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="accessControl">Access Control</TabsTrigger>
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
            <Suspense fallback={<ProtocolSkeleton />}>
              <ProtocolTab node={node} role={role} />
            </Suspense>
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="database">
            <DatabaseTab node={node} role={role} />
          </TabsContent>
          <TabsContent
            className="px-4 py-3 sm:px-6 sm:py-4"
            value="executionClient"
          >
            <ExecutionClientTab
              node={node}
              role={role}
              executionClients={data}
            />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="wallet">
            <WalletTab node={node} role={role} passwords={passwordOptions} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="tls">
            <TLSTab node={node} role={role} secrets={tlsOptions} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
            <APITab node={node} role={role} secrets={passwordOptions} />
          </TabsContent>
          <TabsContent
            className="px-4 py-3 sm:px-6 sm:py-4"
            value="accessControl"
          >
            <AccessControlTab node={node} role={role} />
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
            {token && <LogsTab node={node} role={role} token={token.value} />}
          </TabsContent>
          <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="resources">
            <ResourcesForm
              node={node}
              role={role}
              url={`/chainlink/nodes/${node.name}?workspace_id=${workspaceId}`}
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
}
