import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardStatsProps {
  title: string;
  children: React.ReactNode;
}

export const CardStats = ({ title, children }: CardStatsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold truncate">
        {children}
      </CardContent>
    </Card>
  );
};
