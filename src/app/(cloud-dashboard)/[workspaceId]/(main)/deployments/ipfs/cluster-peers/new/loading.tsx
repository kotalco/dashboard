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

        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />
          <div className="flex ml-2 space-x-2">
            <div className="flex space-x-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-10 h-4" />
            </div>
            <div className="flex space-x-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-10 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-80 h-10" />
        </div>

        <div className="flex space-x-4 items-center">
          <Skeleton className="w-11 h-6 rounded-full" />
          <Skeleton className="w-96 h-4" />
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
