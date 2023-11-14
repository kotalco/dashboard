import { format, fromUnixTime } from "date-fns";
import { Calendar, CreditCard, Sparkles } from "lucide-react";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getUpcomingInvoice } from "@/services/get-upcoming-payment";
import { calculateRemainingDays, formatCurrency } from "@/lib/utils";

export const PlanDetails = async () => {
  const { subscription } = await getCurrentSubscription();
  const { invoice, message } = await getUpcomingInvoice(subscription.id);
  const remainingDays = calculateRemainingDays(subscription.end_date);

  return (
    <div className="flex items-center space-x-10">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-foreground" />
          <p className="text-xs font-bold">
            <span className="font-normal opacity-50">
              This plan provides you with
            </span>{" "}
            <span>
              {subscription.plan.endpoint_limit}{" "}
              {subscription.plan.endpoint_limit > 1 ? "endpoints" : "endpoint"}
            </span>{" "}
            <span className="font-normal opacity-50">and</span>{" "}
            <span>
              {subscription.plan.request_limit}{" "}
              {subscription.plan.request_limit > 1
                ? "requests/sec"
                : "request/sec"}
            </span>
          </p>
        </div>

        <div className="flex space-x-5">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-foreground" />
            <div>
              <div className="text-sm font-semibold leading-5">Started at</div>
              <div className="text-xs font-normal opacity-70">
                {format(fromUnixTime(subscription.start_date), "MMMM do, yyyy")}
              </div>
            </div>
          </div>
          {/* <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-foreground" />

            <div>
              <div className="text-xs font-semibold leading-5">
                {remainingDays ? "Ends at" : "Ended at"}
              </div>
              <div className="text-xs font-normal opacity-70">
                {remainingDays && (
                  <span className="font-bold">
                    {remainingDays !== 1
                      ? `${remainingDays} Days`
                      : `${remainingDays} Day`}
                    ,{` `}
                  </span>
                )}
                {subscription.end_date
                  ? format(fromUnixTime(subscription.end_date), "MMMM do, yyyy")
                  : "-"}
              </div>
            </div>
          </div> */}
        </div>

        {/* If subscription is canceled */}
        {!!subscription.canceled_at && (
          <div className="flex items-center bg-destructive/30 px-3 rounded-xl py-2 space-x-3">
            <p className="text-xs font-bold leading-5">
              <span className="font-normal opacity-50">
                Subscription was canceled at
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
            <p className="text-xs font-bold leading-5">
              <span className="font-normal opacity-50">
                Next payment amount
              </span>{" "}
              {formatCurrency(invoice.amount_due)}
              <span className="font-normal opacity-50">, due </span> (
              {remainingDays && (
                <span className="font-bold text-foreground">
                  {remainingDays !== 1
                    ? `${remainingDays} Days`
                    : `${remainingDays} Day`}
                </span>
              )}
              )<span className="font-normal opacity-50">, at </span>
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
