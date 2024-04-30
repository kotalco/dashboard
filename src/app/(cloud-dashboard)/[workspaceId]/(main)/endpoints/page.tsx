import { Suspense } from "react";

import { Heading } from "@/components/ui/heading";
import { NodesListSkeleton } from "@/components/nodes-list-skeleton";

import { EndpointsList } from "./_components/endpoints-list";

export default async function EndpointsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = params;

  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="Endpoints" />
      </div>

      <Suspense fallback={<NodesListSkeleton />}>
        <EndpointsList workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
