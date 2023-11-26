"use client";

import { Fragment, useTransition } from "react";
import { RadioGroup } from "@headlessui/react";

import { Plan, Subscription } from "@/types";
import { cn, dispatchLocalStorageUpdate, findPrice } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProration } from "@/lib/actions";
import { StorageItems } from "@/enums";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface PlanSelectionProps {
  currentSubscription: Subscription;
  plans: Plan[];
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({
  currentSubscription,
  plans,
}) => {
  const [isPending, startTransition] = useTransition();
  const planData = useLocalStorage(StorageItems.CHANGE_PLAN_DATA);
  const currentPlanId = currentSubscription.plan.id;
  const currentPriceId = currentSubscription.price.id;
  const currentPrice = currentSubscription.price.price;
  const subscriptionId = currentSubscription.id;

  const handlePlanChange = async (value: string) => {
    startTransition(async () => {
      localStorage.removeItem(StorageItems.CHANGE_PLAN_DATA);
      dispatchLocalStorageUpdate(StorageItems.CHANGE_PLAN_DATA, null);
      const state = await getProration(subscriptionId, value);
      localStorage.setItem(
        StorageItems.CHANGE_PLAN_DATA,
        JSON.stringify(state)
      );
      dispatchLocalStorageUpdate(
        StorageItems.CHANGE_PLAN_DATA,
        JSON.stringify(state)
      );
    });
  };

  return (
    <>
      <div className="w-5/12 pr-6">
        <RadioGroup
          name="plan"
          defaultValue={`${currentPlanId},${currentPriceId},${currentPrice}`}
          onChange={handlePlanChange}
          className="space-y-3"
        >
          {plans?.map((plan) => {
            const price = findPrice(plan);
            return (
              <RadioGroup.Option
                disabled={
                  `${currentPlanId},${currentPriceId},${currentPrice}` ===
                  `${plan.id},${price?.id},${price?.price}`
                }
                value={`${plan.id},${price?.id},${price?.price}`}
                key={plan.id}
                className={`p-4 relative rounded-lg ui-disabled:pointer-events-none ui-disabled:cursor-default border ui-not-checked:border-gray-200 ui-checked:border-primary flex justify-between items-center cursor-pointer`}
              >
                {({ checked }) => (
                  <>
                    <div>
                      <div className="flex space-x-5 items-center">
                        <p className="text-lg font-bold font-nunito">
                          {plan.name}
                        </p>
                        {`${currentPlanId},${currentPriceId},${currentPrice}` ===
                          `${plan.id},${price?.id},${price?.price}` && (
                          <Badge className="">Current Plan</Badge>
                        )}
                      </div>
                      <div className="flex gap-x-4 w-full mb-3">
                        <p className="text-base font-semibold">
                          {plan.endpoint_limit}{" "}
                          {plan.endpoint_limit > 1 ? "endpoints" : "endpoint"}
                        </p>
                        <p className="text-base font-semibold">
                          {plan.request_limit}{" "}
                          {plan.request_limit > 1
                            ? "requests/sec"
                            : "request/sec"}
                        </p>
                      </div>

                      <p className="text-sm">
                        $
                        {
                          plan.prices.find(({ period }) => period === "monthly")
                            ?.price
                        }{" "}
                        / Month
                      </p>
                    </div>
                    <div
                      className={cn("inline-block w-4 h-4 rounded-full", {
                        "border-2 border-primary": checked,
                        "border border-gray-300": !checked,
                      })}
                    >
                      <div className="w-2 h-2 m-auto mt-0.5 rounded-full ui-checked:border-2 ui-checked:border-primary ui-checked:bg-primary" />
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            );
          })}
        </RadioGroup>
      </div>

      {isPending && (
        <div className="w-7/12 pl-6">
          <div className="justify-between flex flex-col relative h-full overflow-hidden">
            <div className="space-y-3">
              {Array.from({ length: 2 }, (_, index) => (
                <Fragment key={index}>
                  <div className="flex justify-between">
                    <Skeleton className="w-2/4 h-6" />
                    <Skeleton className="w-1/4 h-6" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="w-1/4 h-6" />
                    <Skeleton className="w-1/4 h-6" />
                  </div>
                </Fragment>
              ))}
            </div>

            <Skeleton className="w-full h-10 mt-20" />
          </div>
        </div>
      )}

      {!planData && !isPending && (
        <div className="w-7/12 pl-6 flex justify-center items-center border text-xl font-semibold rounded-lg text-accent-foreground">
          <p>Please select your new plan</p>
        </div>
      )}
    </>
  );
};
