import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { cn, getEnumKey } from "@/lib/utils";
import { SubscriptionStatus } from "@/enums";
import { Alert } from "@/components/ui/alert";

export const ManagePlanCard = async () => {
  const supscriptionPromise = getCurrentSubscription();
  const plansPromise = getPlans();

  const [{ subscription }, { plans }] = await Promise.all([
    supscriptionPromise,
    plansPromise,
  ]);

  return (
    <div className="space-y-3">
      <Suspense fallback={<Skeleton className="w-[200px] h-10" />}>
        <UserCreditBalance />
      </Suspense>
      {subscription.status === SubscriptionStatus["Past Due"] && (
        <Alert variant="destructive" className="text-center">
          Your last payment attempt has been failed. You can complete your
          payment by clicking on <strong>continue your payment</strong> from
          invoices section.
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            {subscription.plan.name} Plan{" "}
            <span
              className={cn("text-sm font-semibold tracking-wider", {
                "text-green-600":
                  subscription.status === SubscriptionStatus.Active,
                "text-destructive":
                  subscription.status !== SubscriptionStatus.Active,
              })}
            >
              {getEnumKey(SubscriptionStatus, subscription.status)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlanDetails />
        </CardContent>
        <CardFooter className="flex justify-end gap-x-2">
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
    </div>
  );
};
