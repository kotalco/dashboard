import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { BeaconNode, ExecutionClientNode, Validator } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { ExecutionClientClient } from "./components/execution-client-client";
import { BeaconNodesClient } from "./components/beacon-node-client";
import { ValidatorClient } from "./components/validator-client";
import { Roles } from "@/enums";
import { ButtonGroup } from "@/components/ui/button-group";

export default async function EthereumPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: {
    deployment: "execution-clients" | "beacon-nodes" | "validators";
  };
}) {
  const menu = [
    {
      title: "Execution Client",
      href: `/${params.workspaceId}/deployments/ethereum/execution-clients/new`,
    },
    {
      title: "Beacon Node",
      href: `/${params.workspaceId}/deployments/ethereum/beacon-nodes/new`,
    },
    {
      title: "Validator",
      href: `/${params.workspaceId}/deployments/ethereum/validators/new`,
    },
  ];

  const { data: executionClients, count: executionClientsCount } =
    await getNodes<ExecutionClientNode>(params.workspaceId, "/ethereum/nodes");

  const { data: beaconnodes, count: beaconnodesCount } =
    await getNodes<BeaconNode>(params.workspaceId, "/ethereum2/beaconnodes");

  const { data: validators, count: validatorsCount } =
    await getNodes<Validator>(params.workspaceId, "/ethereum2/validators");

  const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="Ethereum Deployments" />
          {role !== Roles.Reader && (
            <ButtonGroup title="Create New" menu={menu} />
          )}
        </div>
        <Tabs defaultValue={searchParams.deployment}>
          <TabsList>
            <TabsTrigger value="execution-clients">
              Execution Client Nodes
              {!!executionClientsCount && (
                <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
                  {executionClientsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="beacon-nodes">
              Beacon Nodes
              {!!beaconnodesCount && (
                <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
                  {beaconnodesCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="validators">
              Validators
              {!!validatorsCount && (
                <span className="flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-foreground/10 text-primary">
                  {validatorsCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="execution-clients">
            <ExecutionClientClient data={executionClients} role={role} />
          </TabsContent>
          <TabsContent value="beacon-nodes">
            <BeaconNodesClient data={beaconnodes} role={role} />
          </TabsContent>
          <TabsContent value="validators">
            <ValidatorClient data={validators} role={role} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
