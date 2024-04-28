import { getCurrentSubscription } from "@/services/get-current-subscription";

import { ReactivatePlan } from "./reactivate-plan";
import { CancelPlan } from "./cancel-plan";

export const SubscriptionActions = async () => {
  const { subscription } = await getCurrentSubscription();

  return (
    <div className="flex justify-end">
      {!!subscription.canceled_at && (
        <ReactivatePlan subscriptionId={subscription.id} />
      )}
      {!subscription.canceled_at && subscription.price.price > 0 && (
        <CancelPlan subscriptionId={subscription.id} />
      )}
    </div>
  );
};
