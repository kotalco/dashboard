import { Suspense } from "react";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { ExecutionClientsList } from "./_components/execution-clients-list";
import { BeaconNodesList } from "./_components/beacon-nodes-list";
import { ValidatorsList } from "./_components/validators-list";
import { ExecutionClientTriggerTab } from "./_components/execution-client-trigger-tab";
import { BeaconNodeTriggerTab } from "./_components/beacon-node-trigger-tab";
import { ValidatorTriggerTab } from "./_components/validator-trigger-tab";
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

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="Ethereum Deployments" />
      </div>

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
