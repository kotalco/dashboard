import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BitcoinNode, PolkadotNode, StacksNode } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { BitconTab } from "./components/bitcoin-tab";
import { NetworkingTab } from "./components/networking-tab";
import { PrometheusTab } from "./components/prometheus-tab";
import { TelemetryTab } from "./components/telemetry-tab";
import { AccessControlTab } from "./components/access-control-tab";
import { LogsTab } from "./components/logs-tab";
import { getNodes } from "@/services/get-nodes";

export default async function StacksNodePage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const secrets = await getSecrets(
    workspaceId,
    SecretType["Stacks Private Key"]
  );
  const { data } = await getNodes<BitcoinNode>(workspaceId, "/bitcoin/nodes");

  try {
    const node = await getNode<StacksNode>(
      workspaceId,
      `/stacks/nodes/${nodeName}`
    );

    const { versions } = await getClientVersions(
      {
        protocol: "stacks",
        component: "node",
        client: "stacks-node",
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
                protocol={Protocol.stacks}
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
                protocol={Protocol.bitcoin}
                token={token.value}
                workspaceId={workspaceId}
              />
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="networking">Networking</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="validator">Bitcoin</TabsTrigger>
              <TabsTrigger value="telemetry">Mining</TabsTrigger>
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
              <NetworkingTab node={node} role={role} secrets={secrets} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
              <APITab node={node} role={role} />
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="validator"
            >
              <BitconTab node={node} role={role} bitcoinNodes={data} />
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="telemetry"
            >
              <TelemetryTab node={node} role={role} />
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="prometheus"
            >
              <PrometheusTab node={node} role={role} />
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

            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="resources"
            >
              <ResourcesForm
                node={node}
                role={role}
                updateUrl={`/polkadot/nodes/${node.name}?workspace_id=${workspaceId}`}
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
