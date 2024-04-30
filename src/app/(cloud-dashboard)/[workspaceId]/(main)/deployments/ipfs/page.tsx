import { Suspense } from "react";

import { Tabs } from "@/components/shared/tabs/tabs";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";

import { IPFSPeersList } from "./_components/ipfs-peers-list";
import { IPFSClusterPeersList } from "./_components/ipfs-cluster-peers-list";
import { PeersTriggerTab } from "./_components/peers-trigger-tab";
import { ClusterPeersTriggerTab } from "./_components/cluster-peers-trigger-tab";
import { CreateIPFSButton } from "./_components/create-ipfs-button";

export default async function IPFSPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: {
    tab: "peers" | "cluster-peers";
  };
}) {
  const { workspaceId } = params;
  const { tab } = searchParams;

  const tabs = [
    {
      label: <PeersTriggerTab workspaceId={workspaceId} />,
      value: "peers",
    },
    {
      label: <ClusterPeersTriggerTab workspaceId={workspaceId} />,
      value: "cluster-peers",
    },
  ];

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="IPFS Deployments" />
      </div>

      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <CreateIPFSButton workspaceId={workspaceId} />
        </Suspense>
      </div>

      <div className="col-span-12">
        <Tabs tabs={tabs} defaultTab={tab} cardDisplay={false}>
          <Suspense fallback={<NodesListSkeleton />}>
            <IPFSPeersList workspaceId={workspaceId} />
          </Suspense>

          <Suspense fallback={<NodesListSkeleton />}>
            <IPFSClusterPeersList workspaceId={workspaceId} />
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}
