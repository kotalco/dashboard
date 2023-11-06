import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getPlans } from "@/services/get-plans";
import { getPaymentMethods } from "@/services/get-payment-methods";
import { ChangePlan } from "./change-plan";
import { CancelPlan } from "./cancel-plan";
import { ReactivatePlan } from "./reactivate-plan";
import { PlanDetails } from "./plan-details";

export const ManagePlanCard = async () => {
  const supscriptionPromise = getCurrentSubscription();
  const plansPromise = getPlans();
  const paymentMethodsPromis = getPaymentMethods();

  const [{ subscription }, { plans }, { cards }] = await Promise.all([
    supscriptionPromise,
    plansPromise,
    paymentMethodsPromis,
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
            <ChangePlan
              plans={plans}
              subscriptionId={subscription.id}
              currentPlanId={subscription.invoice.plan.id}
              currentPriceId={subscription.invoice.price.id}
              currentPrice={subscription.invoice.price.price}
              cards={cards}
            />
          </>
        )}

        {!!subscription.canceled_at && (
          <ReactivatePlan subscriptionId={subscription.id} />
        )}
      </CardFooter>
    </Card>
  );
};
