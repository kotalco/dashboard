import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCreateNode() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-80 h-9" />
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-08 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
          <Skeleton className="w-72 h-5" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
          <Skeleton className="w-72 h-5" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
