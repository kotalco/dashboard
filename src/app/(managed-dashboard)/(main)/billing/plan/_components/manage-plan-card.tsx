import { Suspense } from "react";

import { cn, getEnumKey } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionStatus } from "@/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { ChangePlan } from "./change-plan";
import { CancelPlan } from "./cancel-plan";
import { ReactivatePlan } from "./reactivate-plan";
import { PlanDetails } from "./plan-details";
import { UserCreditBalance } from "./user-credit-balance";

export const ManagePlanCard = async () => {
  const { subscription } = await getCurrentSubscription();

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
          <CardTitle className="text-3xl flex items-center justify-between">
            <div>
              {subscription.plan.name} Plan{" "}
              <span
                className={cn("text-sm font-semibold tracking-wider", {
                  "text-success":
                    subscription.status === SubscriptionStatus.Active,
                  "text-destructive":
                    subscription.status !== SubscriptionStatus.Active,
                })}
              >
                {getEnumKey(SubscriptionStatus, subscription.status)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-muted-foreground">
                ${subscription.price.price} / Month
              </p>
              <p className="text-base">
                {subscription.endpoint_limit} endpoints -{" "}
                {subscription.request_limit} requests / sec
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlanDetails />
        </CardContent>
        <CardFooter className="flex justify-end gap-x-2">
          {!subscription.canceled_at && <ChangePlan />}
        </CardFooter>
      </Card>
    </div>
  );
};
