import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionInfo } from "@/services/get-subscription-info";
import { format } from "date-fns";

export const SubscriptionInfo = async () => {
  const { data } = await getSubscriptionInfo();

  if (data.endpoint_limit) return null;

  return (
    <div className="col-span-12">
      <Card className="col-span-6 row-span-2">
        <CardHeader>
          <CardTitle>Subscription Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-base text-foreground">
            <p className="text-lg">
              You are currently using <strong>{data.name} </strong>
              subscription.
            </p>
            <div className="flex items-center space-x-2">
              <p>
                Subscription status:{" "}
                <span
                  className={`font-semibold ${
                    data?.status === "active" ? "text-green-600" : ""
                  }`}
                >
                  {data.status.charAt(0).toUpperCase()}
                  {data.status.substring(1)}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p>
                Started at{" "}
                <strong>
                  {format(data.start_date * 1000, "MMMM do, yyyy")}
                </strong>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p>
                Will be renewed at{" "}
                <strong>{format(data.end_date * 1000, "MMMM do, yyyy")}</strong>
              </p>
            </div>

            {!!data?.canceled_at && (
              <div className="flex items-center space-x-2">
                <p>
                  Will end at{" "}
                  <strong>
                    {format(data.canceled_at * 1000, "MMMM do, yyyy")}
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
