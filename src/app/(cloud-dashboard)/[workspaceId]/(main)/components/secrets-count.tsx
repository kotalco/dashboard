import Link from "next/link";

import { getSecretsCount } from "@/services/get-secrets-count";

import { CardStats } from "@/components/shared/card-stats/card-stats";

export interface EndpointsCountProps {
  workspaceId: string;
}

export const SecretsCount: React.FC<EndpointsCountProps> = async ({
  workspaceId,
}) => {
  const { count } = await getSecretsCount(workspaceId);

  return (
    <Link
      href={
        count === 0 ? `${workspaceId}/secrets/new` : `${workspaceId}/secrets`
      }
    >
      <CardStats className="hover:bg-muted transition" title="Secrets">
        {count}
      </CardStats>
    </Link>
  );
};
