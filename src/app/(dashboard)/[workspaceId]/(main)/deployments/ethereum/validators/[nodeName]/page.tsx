import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { getSecrets } from "@/services/get-secrets";
import { getNode } from "@/services/get-node";
import { getClientVersions } from "@/services/get-client-versions";
import { Protocol, Roles, SecretType, StorageItems } from "@/enums";
import { BeaconNode, ExecutionClientNode, ValidatorNode } from "@/types";
import { getNodes } from "@/services/get-nodes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { NodeStatus } from "@/components/node-status";
import { NodeMetrics } from "@/components/node-metrics";
import { ResourcesForm } from "@/components/resources-form";
import { ProtocolTab } from "./components/protocol-tab";
import { BeaconNodeTab } from "./components/beacon-node-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { GraffitiTab } from "./components/graffiti-tab";
import { KeystoreTab } from "./components/keystore-tab";
import { Logs } from "@/components/logs";

export default async function BeaconNodePage({
  params,
}: {
  params: { workspaceId: string; nodeName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, nodeName } = params;
  const { role } = await getWorkspace(workspaceId);
  const secrets = await getSecrets(workspaceId);
  const passwords = secrets.filter(({ type }) => type === SecretType.Password);
  const keystores = secrets.filter(
    ({ type }) => type === SecretType["Ethereum Keystore"]
  );
  const { data } = await getNodes<BeaconNode>(
    params.workspaceId,
    "/ethereum2/beaconnodes"
  );

  try {
    const node = await getNode<ValidatorNode>(
      workspaceId,
      `/ethereum2/validators/${nodeName}`
    );

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
                workspaceId={workspaceId}
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
                workspaceId={workspaceId}
                component="validators"
              />
            )}
          </div>
          <Tabs defaultValue="protocol">
            <TabsList>
              <TabsTrigger value="protocol">Protocol</TabsTrigger>
              <TabsTrigger value="Graffiti">Graffiti</TabsTrigger>
              <TabsTrigger value="Keystore">Keystore</TabsTrigger>
              <TabsTrigger value="beaconNode">Beacon Node</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              {role === Roles.Admin && (
                <TabsTrigger
                  value="danger"
                  className="text-destructive data-[state=active]:text-destructive data-[state=active]:bg-destructive/10"
                >
                  Danger Zone
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="protocol">
              <ProtocolTab node={node} role={role} versions={versions} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="Graffiti">
              <GraffitiTab node={node} role={role} />
            </TabsContent>
            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="Keystore">
              <KeystoreTab
                node={node}
                role={role}
                passwords={passwords}
                keystores={keystores}
              />
            </TabsContent>
            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="beaconNode"
            >
              <BeaconNodeTab node={node} role={role} beaconNodes={data} />
            </TabsContent>

            <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="logs">
              {token && (
                <Logs
                  url={`ethereum2/validators/${node.name}/logs?authorization=Bearer ${token.value}&workspace_id=${params.workspaceId}`}
                />
              )}
            </TabsContent>

            <TabsContent
              className="px-4 py-3 sm:px-6 sm:py-4"
              value="resources"
            >
              <ResourcesForm
                node={node}
                role={role}
                updateUrl={`/ethereum2/validators/${node.name}?workspace_id=${workspaceId}`}
              />
            </TabsContent>
            {role === Roles.Admin && (
              <TabsContent className="px-4 py-3 sm:px-6 sm:py-4" value="danger">
                <DangerZoneTab node={node} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
