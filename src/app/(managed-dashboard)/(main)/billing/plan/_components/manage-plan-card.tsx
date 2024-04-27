import { Suspense } from "react";

import { cn, formatCurrency, getEnumKey } from "@/lib/utils";

import { SubscriptionStatus } from "@/enums";
import { getCurrentSubscription } from "@/services/get-current-subscription";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

import { ChangePlan, ChangePlanSkeleton } from "./change-plan";
import { PlanDetails, PlanDetailsSkeleton } from "./plan-details";
import {
  UserCreditBalance,
  UserCreditBalanceSkeleton,
} from "./user-credit-balance";

export const ManagePlanCard = async () => {
  const { subscription } = await getCurrentSubscription();

  return (
    <div className="space-y-3">
      <Suspense fallback={<UserCreditBalanceSkeleton />}>
        <UserCreditBalance />
      </Suspense>
      {subscription.status === SubscriptionStatus["Past Due"] && (
        <Alert variant="destructive" className="text-center">
          Your last payment attempt has been failed. You can complete your
          payment by clicking on <strong>continue your payment</strong> from
          invoices section.
        </Alert>
      )}
      <Card className="bg-[#4E39F8]/20 border-[#4E39F8]">
        <CardHeader>
          <CardTitle className="text-3xl flex items-start justify-between">
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
              <p className="text-lg">
                {subscription.request_limit} Requests / Sec
              </p>
              <p className="text-lg">{subscription.endpoint_limit} Endpoints</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(subscription.price.price)} / Month
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-end">
          <Suspense fallback={<PlanDetailsSkeleton />}>
            <PlanDetails />
          </Suspense>
          {!subscription.canceled_at && (
            <Suspense fallback={<ChangePlanSkeleton />}>
              <ChangePlan />
            </Suspense>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
