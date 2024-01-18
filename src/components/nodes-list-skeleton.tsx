import { Skeleton } from "@/components/ui/skeleton";

export const NodesListSkeleton = () => {
  return (
    <div className="col-span-12">
      <div className="divide-y max-w-sm divide-white">
        {Array.from({ length: 5 }, (_, i) => i).map((i) => (
          <Skeleton className="w-full h-[88px] rounded-none" key={i} />
        ))}
      </div>
    </div>
  );
};
