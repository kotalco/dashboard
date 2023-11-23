import { Skeleton } from "@/components/ui/skeleton";

export const NodesListSkeleton = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />

          <Skeleton className="h-9 w-60" />
        </div>

        <div className="divide-y divide-white">
          {Array.from({ length: 5 }, (_, i) => i).map((i) => (
            <Skeleton className="w-full h-[88px]" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
