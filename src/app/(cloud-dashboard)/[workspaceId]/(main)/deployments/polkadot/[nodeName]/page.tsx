import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { PolkadotNode } from "@/types";
import { getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";

import { PolkadotNodeStats } from "./components/polkadot-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { ValidatorTab } from "./components/validator-tab";
import { NetworkingTab } from "./components/networking-tab";
import { PrometheusTab } from "./components/prometheus-tab";
import { TelemetryTab } from "./components/telemetry-tab";
import { AccessControlTab } from "./components/access-control-tab";
import { LogsTab } from "./components/logs-tab";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Networking", value: "networking" },
  { label: "Validator", value: "validator" },
  { label: "Telemetry", value: "telemetry" },
  { label: "Prometheus", value: "prometheus" },
  { label: "API", value: "api" },
  { label: "Access Control", value: "access-control" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function PolkadotPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options } = await getSecrets(
    workspaceId,
    SecretType["Polkadot Private Key"]
  );

  const { data: node } = await getNode<PolkadotNode>(
    workspaceId,
    `/polkadot/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/polkadot`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "polkadot",
      component: "node",
      client: "polkadot",
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
              protocol={Protocol.Polkadot}
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
              <PolkadotNodeStats
                nodeName={node.name}
                token={token.value}
                workspaceId={workspaceId}
              />
              <NodeMetrics
                nodeName={node.name}
                protocol={Protocol.Polkadot}
                token={token.value}
              />
            </>
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <NetworkingTab node={node} role={role} secrets={options} />
          <ValidatorTab node={node} role={role} />
          <TelemetryTab node={node} role={role} />
          <PrometheusTab node={node} role={role} />
          <APITab node={node} role={role} />
          <AccessControlTab node={node} role={role} />
          {token && <LogsTab node={node} role={role} token={token.value} />}
          <ResourcesForm
            node={node}
            role={role}
            url={`/polkadot/nodes/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
