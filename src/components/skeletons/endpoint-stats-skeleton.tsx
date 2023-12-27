import { Skeleton } from "../ui/skeleton";

export const EndpointStatsSkeleton = () => {
  return (
    <div className="h-[325px] mb-8 grid grid-cols-12 gap-4">
      <Skeleton className="col-span-8" />
      <Skeleton className="col-span-4" />
    </div>
  );
};
