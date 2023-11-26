import { Skeleton } from "@/components/ui/skeleton";

export const ProtocolSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-5 w-80" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
};
