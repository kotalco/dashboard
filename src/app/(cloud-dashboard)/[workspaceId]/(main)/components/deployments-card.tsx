import { getCounts } from "@/services/get-counts";

import { CardStats } from "@/components/shared/card-stats/card-stats";

import { DeploymentsChart } from "./deployments-chart";

export const DeploymentsCard = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { deploymentsCount } = await getCounts(workspaceId);

  return (
    <CardStats
      className="col-span-12 lg:col-span-6 row-span-2"
      title="Deployments"
    >
      <DeploymentsChart counts={deploymentsCount} />
    </CardStats>
  );
};
