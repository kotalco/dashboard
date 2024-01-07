import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolSkeleton } from "@/components/skeletons/protocol-skeleton";
import { Tabs } from "@/components/shared/tabs/tabs";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BitcoinNode } from "@/types";

import { BitcoinNodeStats } from "./_components/bitcoin-node-stats";
import { ProtocolTab } from "./_components/protocol-tab";
import { APITab } from "./_components/api-tab";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { WalletTab } from "./_components/wallet-tab";
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "API", value: "api" },
  { label: "Wallet", value: "wallet" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options } = await getSecrets(workspaceId, SecretType.Password);

  const { data: node } = await getNode<BitcoinNode>(
    workspaceId,
    `/bitcoin/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/bitcoin`);
  }

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
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <Suspense fallback={<ProtocolSkeleton />}>
            <ProtocolTab node={node} role={role} />
          </Suspense>
          <APITab node={node} role={role} secrets={options} />
          <WalletTab node={node} role={role} />
          <Logs
            url={`bitcoin/nodes/${node.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${workspaceId}`}
          />
          <ResourcesForm
            node={node}
            role={role}
            url={`/bitcoin/nodes/${node.name}?workspace_id=${workspaceId}`}
          />

          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
