import { format, fromUnixTime } from "date-fns";
import { Calendar, CreditCard } from "lucide-react";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getUpcomingInvoice } from "@/services/get-upcoming-payment";

import { Skeleton } from "@/components/ui/skeleton";

export const PlanDetails = async () => {
  const { subscription } = await getCurrentSubscription();
  const { invoice, message } = await getUpcomingInvoice(subscription.id);

  return (
    <div className="flex items-center space-x-10">
      <div className="space-y-3">
        <div className="flex space-x-5">
          <div className="flex items-center text-sm">
            <Calendar className="w-6 h-6 text-foreground mr-3" />
            <div className="gap-x-2">
              <span className="text-muted-foreground">Started at </span>
              <span>
                {format(fromUnixTime(subscription.start_date), "MMMM do, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* If subscription is canceled */}
        {!!subscription.canceled_at && (
          <div className="flex items-center bg-destructive/30 px-3 rounded-xl py-2 space-x-3">
            <p className="text-sm leading-5">
              <span className="font-normal opacity-50">
                Your subscription was canceled at
              </span>{" "}
              {format(fromUnixTime(subscription.canceled_at), "MMMM do, yyyy")}
            </p>
          </div>
        )}

        {message && (
          <p className="text-xs font-bold leading-5 text-destructive">
            {message}
          </p>
        )}

        {/* If subscription is not canceled show upcoming Payment */}
        {invoice && (
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-foreground" />
            <p className="text-sm leading-5">
              <span className="opacity-50">Next payment</span>{" "}
              <span className="opacity-50"> due </span>
              {subscription.end_date
                ? format(fromUnixTime(subscription.end_date), "MMMM do, yyyy")
                : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const PlanDetailsSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex space-x-5">
        <div className="flex items-center">
          <Skeleton className="w-6 h-6 mr-3" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="flex space-x-5">
        <div className="flex items-center">
          <Skeleton className="w-6 h-6 mr-3" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    </div>
  );
};
