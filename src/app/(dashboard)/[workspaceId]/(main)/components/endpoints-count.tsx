import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEndpointsCount } from "@/services/get-endpoints-count";
import Link from "next/link";

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
      <Card>
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl text-muted-foreground">
          {count}
        </CardContent>
      </Card>
    </Link>
  );
};
