import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCreateNode() {
  return (
    <div className="space-y-8">
      <Skeleton className="w-80 h-9" />
      <div className="space-y-4">
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
          <Skeleton className="w-80 h-4" />
        </div>

        <div className="flex space-x-4 items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-11 h-6 rounded-full" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
