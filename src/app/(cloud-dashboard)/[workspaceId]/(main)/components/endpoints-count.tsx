import Link from "next/link";

import { getEndpointsCount } from "@/services/get-endpoints-count";

import { CardStats } from "@/components/shared/card-stats/card-stats";

export interface EndpointsCountProps {
  workspaceId: string;
}

export const EndpointsCount: React.FC<EndpointsCountProps> = async ({
  workspaceId,
}) => {
  const { count } = await getEndpointsCount(workspaceId);

  return (
    <Link
      href={
        count === 0
          ? `${workspaceId}/endpoints/new`
          : `${workspaceId}/endpoints`
      }
    >
      <CardStats className="hover:bg-muted transition" title="Endpoints">
        {count}
      </CardStats>
    </Link>
  );
};
