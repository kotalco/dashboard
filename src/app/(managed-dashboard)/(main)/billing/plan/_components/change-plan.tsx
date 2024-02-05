import { Plan } from "@/types";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanSelection } from "./plan-selection";
import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getPlans } from "@/services/get-plans";
import { PaymentDetailsList } from "./payment-details-list";
import { ChangePlanDialog } from "./change-plan-dialog";
import { CardSelection } from "./card-selection";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ChangePlan = async () => {
  const supscriptionPromise = getCurrentSubscription();
  const plansPromise = getPlans();

  const [{ subscription }, { plans }] = await Promise.all([
    supscriptionPromise,
    plansPromise,
  ]);

  return (
    <ChangePlanDialog>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
        </DialogHeader>
        <div className="relative flex">
          <PlanSelection currentSubscription={subscription} plans={plans} />
          <PaymentDetailsList>
            <Suspense fallback={<CardsSkeleton />}>
              <CardSelection />
            </Suspense>
          </PaymentDetailsList>
        </div>
      </DialogContent>
    </ChangePlanDialog>
  );
};

const CardsSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};
