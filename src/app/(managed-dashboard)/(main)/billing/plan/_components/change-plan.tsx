import { Suspense } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { PlanSelection, PlanSelectionSkeleton } from "./plan-selection";
import { ChangePlanDialog } from "./change-plan-dialog";

export const ChangePlan = async () => {
  return (
    <ChangePlanDialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
        </DialogHeader>
        <div>
          <Suspense fallback={<PlanSelectionSkeleton />}>
            <PlanSelection />
          </Suspense>

          {/* <PaymentDetailsList>
            <Suspense fallback={<CardsSkeleton />}>
              <CardSelection />
            </Suspense>
          </PaymentDetailsList> */}
        </div>
      </DialogContent>
    </ChangePlanDialog>
  );
};

export const ChangePlanSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full h-[118px]" />
    </div>
  );
};
