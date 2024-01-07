import { redirect } from "next/navigation";
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
import { ExecutionClientNode } from "@/types";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";

import { ExecutionClientNodeStats } from "./components/execution-client-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { AccessControlTab } from "./components/access-control-tab";
import { NetworkingTab } from "./components/networking-tab";
import { LogsTab } from "./components/logs-tab";
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Networking", value: "networking" },
  { label: "API", value: "api" },
  { label: "Access Control", value: "access-control" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function ExecutionClientPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options: privateKeys } = await getSecrets(
    workspaceId,
    SecretType["Execution Client Private Key"]
  );
  const { options: jwts } = await getSecrets(
    workspaceId,
    SecretType["JWT Secret"]
  );

  const { data: node } = await getNode<ExecutionClientNode>(
    workspaceId,
    `/ethereum/nodes/${nodeName}`
  );

  if (!node) {
    redirect(
      `/${workspaceId}/deployments/ethereum?deployment=execution-clients`
    );
  }

  const { versions } = await getClientVersions(
    {
      protocol: "ethereum",
      component: "executionEngine",
      client: node.client,
    },
    node.image
  );

  const tabs =
    node.client === ExecutionClientClients.Nethermind
      ? TABS.filter((tab) => tab.value !== "access-control")
      : TABS;

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          {token && (
            <NodeStatus
              nodeName={node.name}
              protocol={Protocol.Ethereum}
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
              <ExecutionClientNodeStats
                nodeName={node.name}
                token={token.value}
                workspaceId={workspaceId}
              />
              <NodeMetrics
                nodeName={node.name}
                protocol={Protocol.Ethereum}
                token={token.value}
              />
            </>
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(tabs, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <NetworkingTab node={node} role={role} secrets={privateKeys} />
          <APITab node={node} role={role} secrets={jwts} />

          {node.client !== ExecutionClientClients.Nethermind && (
            <AccessControlTab node={node} role={role} />
          )}

          {token && <LogsTab node={node} role={role} token={token.value} />}
          <ResourcesForm
            node={node}
            role={role}
            url={`/ethereum/nodes/${node.name}?workspace_id=${workspaceId}`}
          />

          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
