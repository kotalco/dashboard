import { Suspense } from "react";

import { Heading } from "@/components/ui/heading";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";

import { StacksNodesList } from "./_components/stacks-nodes-list";

export default async function StacksPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="Stacks Deployments" />
      </div>

      <Suspense fallback={<NodesListSkeleton />}>
        <StacksNodesList workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
