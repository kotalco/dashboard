import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BeaconNode, ValidatorNode } from "@/types";
import { getNodes } from "@/services/get-nodes";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { Logs } from "@/components/logs";

import { ProtocolTab } from "./components/protocol-tab";
import { BeaconNodeTab } from "./components/beacon-node-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { GraffitiTab } from "./components/graffiti-tab";
import { KeystoreTab } from "./components/keystore-tab";
import { getAuthorizedTabs } from "@/lib/utils";

const TABS = [
  { label: "Protocol", value: "protocol" },
  { label: "Graffiti", value: "graffiti" },
  { label: "Keystore", value: "keystore" },
  { label: "Beacon Node", value: "beacon-node" },
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
  const { options: passwords } = await getSecrets(
    workspaceId,
    SecretType.Password
  );
  const { options: keystores } = await getSecrets(
    workspaceId,
    SecretType["Ethereum Keystore"]
  );

  const { data } = await getNodes<BeaconNode>(
    params.workspaceId,
    "/ethereum2/beaconnodes"
  );

  const { data: node } = await getNode<ValidatorNode>(
    workspaceId,
    `/ethereum2/validators/${nodeName}`
  );

  if (!node) {
    redirect(`/${workspaceId}/deployments/ethereum?tab=validators`);
  }

  const { versions } = await getClientVersions(
    {
      protocol: "ethereum",
      component: "validatorClient",
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
              component="validators"
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
              protocol={Protocol.Ethereum2}
              token={token.value}
              component="validators"
            />
          )}
        </div>
        <Tabs tabs={getAuthorizedTabs(TABS, role)}>
          <ProtocolTab node={node} role={role} versions={versions} />
          <GraffitiTab node={node} role={role} />
          <KeystoreTab
            node={node}
            role={role}
            passwords={passwords}
            ethereumKeystores={keystores}
          />
          <BeaconNodeTab node={node} role={role} beaconNodes={data} />
          <Logs
            url={`ethereum2/validators/${node.name}/logs?authorization=Bearer ${token?.value}&workspace_id=${params.workspaceId}`}
          />

          <ResourcesForm
            node={node}
            role={role}
            url={`/ethereum2/validators/${node.name}?workspace_id=${workspaceId}`}
          />
          <DangerZoneTab node={node} />
        </Tabs>
      </div>
    </div>
  );
}
