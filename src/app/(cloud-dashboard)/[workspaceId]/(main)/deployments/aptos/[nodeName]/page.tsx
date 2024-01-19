import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getNode } from "@/services/get-node";
import { getWorkspace } from "@/services/get-workspace";
import { Protocol, Roles, StorageItems } from "@/enums";
import { AptosNode } from "@/types";
import { getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ProtocolSkeleton } from "@/components/skeletons/protocol-skeleton";
import { ResourcesForm } from "@/components/resources-form";

import { AptosNodeStats } from "./_components/aptos-node-stats";
import { ProtocolTab } from "./_components/protocol-tab";
import { APITab } from "./_components/api-tab";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { NodeConfig } from "./_components/node-config";
import { getClientVersions } from "@/services/get-client-versions";

const TABS = [
  { label: "Config", value: "config" },
  { label: "Logs", value: "logs" },
  // { label: "Protocol", value: "protocol" },
  // { label: "API", value: "api" },
  // { label: "Logs", value: "logs" },
  // { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { data: node } = await getNode<AptosNode>(
    workspaceId,
    `/aptos/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/aptos`);
  }

  if (!token) return null;

  const { versions } = await getClientVersions(
    {
      protocol: "aptos",
      component: "node",
      client: "aptos-core",
      network: node.network,
    },
    node.image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-start gap-x-2">
          <NodeStatus
            nodeName={node.name}
            protocol={Protocol.Aptos}
            token={token.value}
          />
          <Heading
            title={node.name}
            description={`Created at ${format(
              parseISO(node.createdAt),
              "MMMM do, yyyy"
            )}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <AptosNodeStats nodeName={node.name} token={token.value} />
          <NodeMetrics
            nodeName={node.name}
            protocol={Protocol.Aptos}
            token={token.value}
          />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig node={node} role={role} versions={versions} />
          {/* <Suspense fallback={<ProtocolSkeleton />}>
            <ProtocolTab node={node} role={role} />
          </Suspense> */}
          {/* <APITab node={node} role={role} /> */}
          <Logs
            url={`aptos/nodes/${node.name}/logs?authorization=Bearer ${token.value}&workspace_id=${workspaceId}`}
          />
          {/* <ResourcesForm
            node={node}
            role={role}
            url={`/aptos/nodes/${node.name}`}
          /> */}
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
