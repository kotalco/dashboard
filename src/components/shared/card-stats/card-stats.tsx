import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardStatsProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CardStats = ({ title, className, children }: CardStatsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-4xl truncate">{children}</CardContent>
    </Card>
  );
};
