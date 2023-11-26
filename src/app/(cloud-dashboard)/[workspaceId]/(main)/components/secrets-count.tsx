import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSecretsCount } from "@/services/get-secrets-count";
import Link from "next/link";

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
      <Card>
        <CardHeader>
          <CardTitle>Secrets</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl text-muted-foreground">
          {count}
        </CardContent>
      </Card>
    </Link>
  );
};
