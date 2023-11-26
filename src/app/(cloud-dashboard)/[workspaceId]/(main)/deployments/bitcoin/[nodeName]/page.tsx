import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolSkeleton } from "@/components/skeletons/protocol-skeleton";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BitcoinNode } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BitcoinNodeStats } from "./_components/bitcoin-node-stats";
import { ProtocolTab } from "./_components/protocol-tab";
import { APITab } from "./_components/api-tab";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { WalletTab } from "./_components/wallet-tab";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options } = await getSecrets(workspaceId, SecretType.Password);

  try {
    const node = await getNode<BitcoinNode>(
      workspaceId,
      `/bitcoin/nodes/${nodeName}`
    );

    return (
      <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
          <div className="flex items-start gap-x-2">
            {token && (
              <NodeStatus
                nodeName={node.name}
                protocol={Protocol.Bitcoin}
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
              <>
                <BitcoinNodeStats nodeName={node.name} token={token.value} />
                <NodeMetrics
                  nodeName={node.name}
                  protocol={Protocol.Bitcoin}
                  token={token.value}
                />
              </>
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
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
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="api">
              <APITab node={node} role={role} secrets={options} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="wallet">
              <WalletTab node={node} role={role} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
              {token && (
                <Logs
                  url={`bitcoin/nodes/${node.name}/logs?authorization=Bearer ${token.value}&workspace_id=${workspaceId}`}
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
                url={`/bitcoin/nodes/${node.name}?workspace_id=${workspaceId}`}
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
