import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingCreateNode() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-96 h-9" />
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-96 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-96 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-96 h-4" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}
