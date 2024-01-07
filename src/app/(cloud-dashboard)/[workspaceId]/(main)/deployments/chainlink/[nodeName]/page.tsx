import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { ChainlinkNode, ExecutionClientNode } from "@/types";

import { Tabs } from "@/components/shared/tabs/tabs";
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
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Database", value: "database" },
  { label: "Execution Client", value: "execution-client" },
  { label: "Wallet", value: "wallet" },
  { label: "TLS", value: "tls" },
  { label: "API", value: "api" },
  { label: "Access Control", value: "access-control" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

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
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <Suspense fallback={<ProtocolSkeleton />}>
            <ProtocolTab node={node} role={role} />
          </Suspense>
          <DatabaseTab node={node} role={role} />
          <ExecutionClientTab node={node} role={role} executionClients={data} />
          <WalletTab node={node} role={role} passwords={passwordOptions} />
          <TLSTab node={node} role={role} secrets={tlsOptions} />
          <APITab node={node} role={role} secrets={passwordOptions} />
          <AccessControlTab node={node} role={role} />
          {token && <LogsTab node={node} role={role} token={token.value} />}
          <ResourcesForm
            node={node}
            role={role}
            url={`/chainlink/nodes/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
