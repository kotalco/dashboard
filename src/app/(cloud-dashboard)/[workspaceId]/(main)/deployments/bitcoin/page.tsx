import { Suspense } from "react";

import { Heading } from "@/components/ui/heading";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";

import { BitcoinNodesList } from "./_components/bitcoin-nodes-list";

export default async function BitcoinPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="Bitcoin Deployments" />
      </div>

      <Suspense fallback={<NodesListSkeleton />}>
        <BitcoinNodesList workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
