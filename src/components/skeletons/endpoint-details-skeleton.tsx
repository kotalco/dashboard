import { Skeleton } from "@/components/ui/skeleton";

export const EndpointDetailsSkeleton = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pl-0 pt-6 space-y-4">
        <div className="flex items-center gap-x-3">
          <Skeleton className="w-10 h-14" />

          <div className="space-y-1">
            <Skeleton className="w-[500px] h-9" />
            <Skeleton className="w-64 h-5" />
          </div>
        </div>
      </div>

      <Skeleton className="w-full h-80" />

      <div className="mt-5 flex justify-end">
        <Skeleton className="h-10 w-[137px]" />
      </div>
    </div>
  );
};
