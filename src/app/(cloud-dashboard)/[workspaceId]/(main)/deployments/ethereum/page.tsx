import { getWorkspace } from "@/services/get-workspace";
import { getNodes } from "@/services/get-nodes";
import { BeaconNode, ExecutionClientNode, ValidatorNode } from "@/types";
import { Roles } from "@/enums";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { ButtonGroup } from "@/components/ui/button-group";

import { ExecutionClientsList } from "./_components/execution-clients-list";
import { BeaconNodesList } from "./_components/beacon-nodes-list";
import { ValidatorsList } from "./_components/validators-list";
import { ExecutionClientTriggerTab } from "./_components/execution-client-trigger-tab";
import { BeaconNodeTriggerTab } from "./_components/beacon-node-trigger-tab";
import { ValidatorTriggerTab } from "./_components/validator-trigger-tab";
import { Suspense } from "react";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateEthereumNodesButton } from "./_components/create-ethereum-nodes-button";

export default async function EthereumPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: {
    tab: "execution-clients" | "beacon-nodes" | "validators";
  };
}) {
  const { workspaceId } = params;
  const { tab } = searchParams;

  const menu = [
    {
      title: "Execution Client",
      href: `/${workspaceId}/deployments/ethereum/execution-clients/new`,
    },
    {
      title: "Beacon Node",
      href: `/${workspaceId}/deployments/ethereum/beacon-nodes/new`,
    },
    {
      title: "Validator",
      href: `/${workspaceId}/deployments/ethereum/validators/new`,
    },
  ];

  const tabs = [
    {
      label: <ExecutionClientTriggerTab workspaceId={workspaceId} />,
      value: "execution-clients",
    },
    {
      label: <BeaconNodeTriggerTab workspaceId={workspaceId} />,
      value: "beacon-nodes",
    },
    {
      label: <ValidatorTriggerTab workspaceId={workspaceId} />,
      value: "validators",
    },
  ];

  // const { data: executionClients, count: executionClientsCount } =
  //   await getNodes<ExecutionClientNode>(params.workspaceId, "/ethereum/nodes");

  // const { data: beaconnodes, count: beaconnodesCount } =
  //   await getNodes<BeaconNode>(params.workspaceId, "/ethereum2/beaconnodes");

  // const { data: validators, count: validatorsCount } =
  //   await getNodes<ValidatorNode>(params.workspaceId, "/ethereum2/validators");

  // const { role } = await getWorkspace(params.workspaceId);

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        {/* <div className="flex items-center justify-between"> */}
        <Heading title="Ethereum Deployments" />
        {/* {role !== Roles.Reader && (
            <ButtonGroup title="Create New" menu={menu} />
          )} */}
      </div>
      {/* <Tabs defaultValue={tab || "execution-clients"}>
        <TabsList>
          <TabsTrigger value="execution-clients">
            <ExecutionClientTriggerTab workspaceId={workspaceId} />
          </TabsTrigger>
          <TabsTrigger value="beacon-nodes">
            <BeaconNodeTriggerTab workspaceId={workspaceId} />
          </TabsTrigger>
          <TabsTrigger value="validators">
            <ValidatorTriggerTab workspaceId={workspaceId} />
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
      </Tabs> */}
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateEthereumNodesButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <div className="col-span-12">
        <Tabs tabs={tabs} defaultTab={tab} cardDisplay={false}>
          <Suspense fallback={<NodesListSkeleton />}>
            <ExecutionClientsList workspaceId={workspaceId} />
          </Suspense>

          <Suspense fallback={<NodesListSkeleton />}>
            <BeaconNodesList workspaceId={workspaceId} />
          </Suspense>

          <Suspense fallback={<NodesListSkeleton />}>
            <ValidatorsList workspaceId={workspaceId} />
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}
