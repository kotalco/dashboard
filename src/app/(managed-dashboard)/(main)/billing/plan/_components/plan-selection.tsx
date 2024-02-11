import { getPlans } from "@/services/get-plans";
import { getCurrentSubscription } from "@/services/get-current-subscription";

import { Skeleton } from "@/components/ui/skeleton";

import { PlanSelectionForm } from "./plan-selection-form";
import { Suspense } from "react";
import { CardSelection } from "./card-selection";

export const PlanSelection = async () => {
  const subscriptionPromise = getCurrentSubscription();
  const plansPromise = getPlans();

  const [{ plans }, { subscription }] = await Promise.all([
    plansPromise,
    subscriptionPromise,
  ]);

  const otherPlans = plans?.filter((plan) => plan.id !== subscription.plan.id);

  return (
    <div className="space-y-3">
      <PlanSelectionForm plans={otherPlans} subscriptionId={subscription.id}>
        <Suspense fallback={<div>Loading</div>}>
          <CardSelection />
        </Suspense>
      </PlanSelectionForm>
    </div>
  );
};

export const PlanSelectionSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="w-full h-[118px]" />
      <Skeleton className="w-full h-[118px]" />
    </div>
  );
};
