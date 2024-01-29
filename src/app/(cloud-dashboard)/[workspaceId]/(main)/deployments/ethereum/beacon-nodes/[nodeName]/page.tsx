import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BeaconNode, ExecutionClientNode } from "@/types";
import { getNodes } from "@/services/get-nodes";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { Logs } from "@/components/logs";

import { BeaconNodeStats } from "./components/beacon-node-stats";
import { ProtocolTab } from "./components/protocol-tab";
import { APITab } from "./components/api-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { ExecutionClientTab } from "./components/execution-client-tab";
import { CheckpointSyncTab } from "./components/checkpoint-sync-tab";
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Execution Client", value: "execution-client" },
  { label: "Checkpoint Sync", value: "checkpoint-sync" },
  { label: "API", value: "api" },
  { label: "Logs", value: "logs" },
  { label: "Resources", value: "resources" },
  { label: "Danger Zone", value: "dangerZone", role: Roles.Admin },
];

export default async function BeaconNodePage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const { options } = await getSecrets(workspaceId, SecretType["JWT Secret"]);
  const { data } = await getNodes<ExecutionClientNode>(
    workspaceId,
    "/ethereum/nodes"
  );

  const { data: node } = await getNode<BeaconNode>(
    workspaceId,
    `/ethereum2/beaconnodes/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/ethereum?tab=beacon-nodes`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "ethereum",
      component: "beaconNode",
      client: node.client,
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
              protocol={Protocol.Ethereum2}
              token={token.value}
              component="beaconnodes"
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
              <BeaconNodeStats
                nodeName={node.name}
                token={token.value}
                workspaceId={workspaceId}
              />
              <NodeMetrics
                nodeName={node.name}
                protocol={Protocol.Ethereum2}
                token={token.value}
                component="beaconnodes"
              />
            </>
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <ExecutionClientTab
            node={node}
            role={role}
            secrets={options}
            executionClients={data}
          />
          <CheckpointSyncTab node={node} role={role} />
          <APITab node={node} role={role} />
          <Logs
            url={`ethereum2/beaconnodes/${node.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />
          <ResourcesForm
            node={node}
            role={role}
            url={`/ethereum2/beaconnodes/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
