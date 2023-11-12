import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getPlans } from "@/services/get-plans";
import { ChangePlan } from "./change-plan";
import { CancelPlan } from "./cancel-plan";
import { ReactivatePlan } from "./reactivate-plan";
import { PlanDetails } from "./plan-details";
import { UserCreditBalance } from "./user-credit-balance";
import { Skeleton } from "@/components/ui/skeleton";

export const ManagePlanCard = async () => {
  const supscriptionPromise = getCurrentSubscription();
  const plansPromise = getPlans();

  const [{ subscription }, { plans }] = await Promise.all([
    supscriptionPromise,
    plansPromise,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscription.plan.name} Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <PlanDetails />
      </CardContent>
      <CardFooter className="flex justify-between gap-x-2">
        <Suspense fallback={<Skeleton className="w-[200px] h-10" />}>
          <UserCreditBalance />
        </Suspense>
        {!subscription.canceled_at && (
          <div className="space-x-4">
            <ChangePlan plans={plans} />
            <CancelPlan subscriptionId={subscription.id} />
          </div>
        )}

        {!!subscription.canceled_at && (
          <ReactivatePlan subscriptionId={subscription.id} />
        )}
      </CardFooter>
    </Card>
  );
};
