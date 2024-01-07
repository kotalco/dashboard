import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { NEARNode } from "@/types";
import { getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";
import { ResourcesForm } from "@/components/resources-form";

import { NEARNodeStats } from "./components/near-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { RPCTab } from "./components/rpc-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { ValidatorTab } from "./components/validator-tab";
import { NetworkingTab } from "./components/networking-tab";
import { PrometheusTab } from "./components/prometheus-tab";
import { TelemetryTab } from "./components/telemetry-tab";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Networking", value: "networking" },
  { label: "RPC", value: "rpc" },
  { label: "Validator", value: "validator" },
  { label: "Prometheus", value: "prometheus" },
  { label: "Telemetry", value: "telemetry" },
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
  const { options } = await getSecrets(
    workspaceId,
    SecretType["NEAR Private Key"]
  );

  const { data: node } = await getNode<NEARNode>(
    workspaceId,
    `/near/nodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/near`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "near",
      component: "node",
      client: "nearcore",
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
              protocol={Protocol.NEAR}
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
              <NEARNodeStats
                nodeName={node.name}
                token={token.value}
                workspaceId={workspaceId}
              />
              <NodeMetrics
                nodeName={node.name}
                protocol={Protocol.NEAR}
                token={token.value}
              />
            </>
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <NetworkingTab node={node} role={role} secrets={options} />
          <RPCTab node={node} role={role} />
          <ValidatorTab node={node} role={role} secrets={options} />
          <PrometheusTab node={node} role={role} />
          <TelemetryTab node={node} role={role} />
          <Logs
            url={`near/nodes/${node.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${workspaceId}`}
          />
          <ResourcesForm
            node={node}
            role={role}
            url={`/near/nodes/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
