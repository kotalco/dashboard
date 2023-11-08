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
        <CardTitle>{subscription.invoice.plan.name} Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <PlanDetails />
      </CardContent>
      <CardFooter className="flex flex-row-reverse gap-x-2">
        {!subscription.canceled_at && (
          <>
            <CancelPlan subscriptionId={subscription.id} />
            <ChangePlan plans={plans} />
          </>
        )}

        {!!subscription.canceled_at && (
          <ReactivatePlan subscriptionId={subscription.id} />
        )}
      </CardFooter>
    </Card>
  );
};
