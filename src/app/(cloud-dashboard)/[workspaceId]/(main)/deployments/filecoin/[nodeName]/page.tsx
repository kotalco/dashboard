import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, StorageItems } from "@/enums";
import { FilecoinNode, IPFSPeer } from "@/types";
import { getNodes } from "@/services/get-nodes";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";

import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { IPFSTab } from "./components/ipfs-tab";
import { LogsTab } from "./components/logs-tab";
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "API", value: "api" },
  { label: "IPFS", value: "ipfs" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function AptosPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { data } = await getNodes<IPFSPeer>(workspaceId, "/ipfs/peers");

  const { data: node } = await getNode<FilecoinNode>(
    workspaceId,
    `/filecoin/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/filecoin`);
  }

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
              protocol={Protocol.Filecoin}
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
              protocol={Protocol.Filecoin}
              token={token.value}
            />
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <APITab node={node} role={role} />
          <IPFSTab node={node} role={role} peers={data} />
          {token && <LogsTab node={node} role={role} token={token.value} />}
          <ResourcesForm
            node={node}
            role={role}
            url={`/filecoin/nodes/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
