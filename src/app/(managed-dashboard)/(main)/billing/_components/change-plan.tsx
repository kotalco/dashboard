"use client";

import { useState, useTransition } from "react";
import { RadioGroup } from "@headlessui/react";

import { Button } from "@/components/ui/button";
import { getProration } from "@/lib/actions";
import { PaymentCard, Plan, Proration } from "@/types";
import { cn, findPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentDetailsList } from "./payment-details-list";

interface ChangePlanProps {
  plans: Plan[];
  subscriptionId: string;
  currentPlanId: string;
  currentPriceId: string;
  currentPrice: number;
  cards: PaymentCard[];
}

export const ChangePlan: React.FC<ChangePlanProps> = ({
  plans,
  subscriptionId,
  currentPlanId,
  currentPriceId,
  currentPrice,
  cards,
}) => {
  const [price, setPrice] = useState<string>();
  const [proration, setProration] = useState<Proration>();
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handlePlanChange = (value: string) => {
    startTransition(async () => {
      const { proration, price, message } = await getProration(
        subscriptionId,
        value
      );
      setPrice(price);
      setProration(proration);
      setMessage(message);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Change Plan</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <form>
            <div className="flex">
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
                            {`${currentPlanId},${currentPriceId},${currentPrice}` ===
                              `${plan.id},${price?.id},${price?.price}` && (
                              <Badge className="absolute top-3 right-4">
                                Current Plan
                              </Badge>
                            )}
                            <div>
                              <p className="mb-1 text-xs font-medium leading-3">
                                {plan.name}
                              </p>

                              <p className="mb-1 text-base font-bold leading-9">
                                $
                                {
                                  plan.prices.find(
                                    ({ period }) => period === "monthly"
                                  )?.price
                                }{" "}
                                / Month
                              </p>
                              <div className="flex gap-x-4 w-full">
                                <p className="text-xs font-medium leading-3">
                                  {plan.endpoint_limit}{" "}
                                  {plan.endpoint_limit > 1
                                    ? "endpoints"
                                    : "endpoint"}
                                </p>
                                <p className="text-xs font-medium leading-3">
                                  {plan.request_limit}{" "}
                                  {plan.request_limit > 1
                                    ? "requests/min"
                                    : "request/min"}
                                </p>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "inline-block w-4 h-4 rounded-full",
                                {
                                  "border-2 border-primary": checked,
                                  "border border-gray-300": !checked,
                                }
                              )}
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

              <div className="w-7/12 pl-6">
                <PaymentDetailsList
                  proration={proration}
                  price={price}
                  isPending={isPending}
                  message={message}
                  cards={cards}
                />
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
