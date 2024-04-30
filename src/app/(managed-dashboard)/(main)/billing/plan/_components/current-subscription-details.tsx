import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/types";

interface CurrentSubscripitonDetailsProps {
  subscription: Subscription;
}

export const CurrentSubscripitonDetails = async ({
  subscription,
}: CurrentSubscripitonDetailsProps) => {
  return (
    <div className="p-4 border-l-4 border-l-primary relative rounded-lg border flex justify-between items-center">
      <div>
        <div className="flex space-x-5 items-center">
          <p className="text-lg font-bold font-nunito">
            {subscription.plan.name}
          </p>

          <Badge>Current Plan</Badge>
        </div>
        <div className="flex gap-x-4 w-full mb-3">
          <p className="text-base font-semibold">
            {subscription.plan.endpoint_limit}{" "}
            {subscription.plan.endpoint_limit > 1 ? "endpoints" : "endpoint"}
          </p>
          <p className="text-base font-semibold">
            {subscription.plan.request_limit}{" "}
            {subscription.plan.request_limit > 1
              ? "requests/sec"
              : "request/sec"}
          </p>
        </div>
      </div>
      <div className="inline-block w-4 h-4 rounded-full">
        <div className="w-2 h-2 m-auto mt-0.5 rounded-full ui-checked:border-2 ui-checked:border-primary ui-checked:bg-primary" />
      </div>
    </div>
  );
};
