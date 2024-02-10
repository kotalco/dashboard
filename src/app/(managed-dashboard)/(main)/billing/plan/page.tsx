import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { InvoicesHistory } from "./_components/invoices-history";
import { ManagePlanCard } from "./_components/manage-plan-card";
import { SubscriptionActions } from "./_components/subscription-actions";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: { limit?: string };
}) {
  return (
    <div className="space-y-8">
      <ManagePlanCard />
      <Suspense fallback={<Skeleton className="w-full h-60" />}>
        <InvoicesHistory limit={searchParams.limit} />
      </Suspense>
      <SubscriptionActions />
    </div>
  );
}
