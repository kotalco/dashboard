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
          <Skeleton className="w-80 h-4" />
        </div>

        <div className="space-y-2 max-w-sm">
          <Skeleton className="w-20 h-4" />
          <div className="grid grid-cols-2 ml-5 gap-3">
            {Array.from({ length: 9 }, (_, i) => i).map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-40 h-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
}
