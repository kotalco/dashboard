import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { NEARNode } from "@/types";
import { formatDate, getAuthorizedTabs } from "@/lib/utils";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { Logs } from "@/components/logs";

import { NEARNodeStats } from "./_components/near-node-stats";
import { DangerZoneTab } from "./_components/danger-zone-tab";
import { NodeConfig } from "./_components/node-config";

const TABS = [
  { label: "Configurations", value: "config" },
  // { label: "Protocol", value: "protocol" },
  // { label: "Networking", value: "networking" },
  // { label: "RPC", value: "rpc" },
  // { label: "Validator", value: "validator" },
  // { label: "Prometheus", value: "prometheus" },
  // { label: "Telemetry", value: "telemetry" },
  { label: "Logs", value: "logs" },
  // { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const { workspaceId, nodeName } = params;
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { role } = await getWorkspace(workspaceId);

  const { options: privateKeys } = await getSecrets(
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

  if (!token) return null;
  const { name, createdAt, image } = node;
  const { value } = token;

  const { versions } = await getClientVersions(
    {
      protocol: "near",
      component: "node",
      client: "nearcore",
    },
    image
  );

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-start gap-x-2">
          <NodeStatus nodeName={name} protocol={Protocol.NEAR} token={value} />
          <Heading
            title={name}
            description={`Created at ${formatDate(createdAt)}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-4">
          <NEARNodeStats
            nodeName={name}
            token={value}
            workspaceId={workspaceId}
          />
          <NodeMetrics nodeName={name} protocol={Protocol.NEAR} token={value} />
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)} cardDisplay={false}>
          <NodeConfig
            node={node}
            role={role}
            versions={versions}
            privateKeys={privateKeys}
          />
          {/* <ProtocolTab node={node} role={role} versions={versions} />
          <NetworkingTab node={node} role={role} secrets={options} />
          <RPCTab node={node} role={role} />
          <ValidatorTab node={node} role={role} secrets={options} />
          <PrometheusTab node={node} role={role} />
          <TelemetryTab node={node} role={role} /> */}
          <Logs
            url={`near/nodes/${node.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${workspaceId}`}
          />
          {/* <ResourcesForm
            node={node}
            role={role}
            url={`/near/nodes/${node.name}?workspace_id=${workspaceId}`}
          /> */}
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
