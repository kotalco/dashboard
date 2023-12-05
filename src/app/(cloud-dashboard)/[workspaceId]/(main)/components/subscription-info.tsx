import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionInfo } from "@/services/get-subscription-info";
import { format } from "date-fns";

export const SubscriptionInfo = async () => {
  const subscription = await getSubscriptionInfo();

<<<<<<< HEAD
  if (subscription.endpoint_limit) return null;
=======
  if (!subscription) return null;
>>>>>>> a000daa (add env production)

  return (
    <div className="col-span-12">
      <Card className="col-span-6 row-span-2">
        <CardHeader>
          <CardTitle>Subscription Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-base text-foreground">
            <p className="text-lg">
              You are currently using <strong>{subscription.name} </strong>
              subscription.
            </p>
            <div className="flex items-center space-x-2">
              <p>
                Subscription status:{" "}
                <span
                  className={`font-semibold ${
                    subscription?.status === "active" ? "text-green-600" : ""
                  }`}
                >
                  {subscription.status.charAt(0).toUpperCase()}
                  {subscription.status.substring(1)}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p>
                Started at{" "}
                <strong>
                  {format(subscription.start_date * 1000, "MMMM do, yyyy")}
                </strong>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p>
                Will be renewed at{" "}
                <strong>
                  {format(subscription.end_date * 1000, "MMMM do, yyyy")}
                </strong>
              </p>
            </div>

            {!!subscription?.canceled_at && (
              <div className="flex items-center space-x-2">
                <p>
                  Will end at{" "}
                  <strong>
                    {format(subscription.canceled_at * 1000, "MMMM do, yyyy")}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
