import { getCounts } from "@/services/get-counts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DeploymentsChart } from "./deployments-chart";

export const DeploymentsCard = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { deploymentsCount } = await getCounts(workspaceId);

  return (
    <Card className="col-span-6 row-span-2">
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        <DeploymentsChart counts={deploymentsCount} />
      </CardContent>
    </Card>
  );
};
