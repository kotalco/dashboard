"use client";

import { Plan } from "@/types";
import { useAction } from "@/hooks/use-action";
import { getProration } from "@/actions/get-proration";
import { useChangeSubscriptionModal } from "@/hooks/use-change-subscription-modal";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { FormErrors } from "@/components/form/form-errors";

import { PaymentDetailsList } from "./payment-details-list";

interface PlanSelectionFormProps {
  plans: Plan[];
  subscriptionId: string;
  children?: React.ReactNode;
}

export const PlanSelectionForm = ({
  plans,
  subscriptionId,
  children,
}: PlanSelectionFormProps) => {
  const { step, nextStep, setPlanPrice, setNewSubscriptionData } =
    useChangeSubscriptionModal();
  const { execute, error, fieldErrors, data } = useAction(getProration, {
    onSuccess: () => {
      nextStep();
    },
  });

  const onSubmit = (formData: FormData) => {
    const price_id = formData.get("price_id") as string;
    const plan = plans.find((plan) =>
      plan.prices.some((p) => p.id === price_id)
    );
    const price = plan?.prices.find((p) => p.id === price_id)?.price;

    setPlanPrice(price);
    if (plan) {
      setNewSubscriptionData({
        price_id,
        subscription_id: subscriptionId,
        plan_id: plan.id,
      });
    }
    execute({ subscription_id: subscriptionId, provider: "stripe", price_id });
  };

  if (step === 1) {
    return (
      <form action={onSubmit} className="w-full space-y-4">
        <RadioGroup name="price_id" className="space-y-3">
          {plans.map((plan) => (
            <Label
              key={plan.id}
              className={`p-4 relative rounded-lg border flex justify-between items-center cursor-pointer`}
            >
              <div>
                <div className="flex space-x-5 items-center">
                  <p className="text-lg font-bold font-nunito">{plan.name}</p>
                </div>
                <div className="flex gap-x-4 w-full mb-3">
                  <p className="text-base font-semibold">
                    {plan.endpoint_limit}{" "}
                    {plan.endpoint_limit > 1 ? "endpoints" : "endpoint"}
                  </p>
                  <p className="text-base font-semibold">
                    {plan.request_limit}{" "}
                    {plan.request_limit > 1 ? "requests/sec" : "request/sec"}
                  </p>
                </div>

                {plan.prices.map((price) => (
                  <p key={price.id}>${price.price} / Month</p>
                ))}
              </div>
              <div className="inline-block w-4 h-4 rounded-full">
                <div className="w-2 h-2 m-auto mt-0.5 rounded-full ui-checked:border-2 ui-checked:border-primary ui-checked:bg-primary" />
              </div>
              {plan.prices.map((price) => (
                <RadioGroupItem key={price.id} value={price.id} />
              ))}
            </Label>
          ))}
        </RadioGroup>

        <FormErrors id="price_id" errors={fieldErrors} />

        <SubmitError error={error} />
        <div className="flex justify-end space-x-3">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>

          <SubmitButton>Continue</SubmitButton>
        </div>
      </form>
    );
  }

  if (step === 2) {
    return <PaymentDetailsList data={data}>{children}</PaymentDetailsList>;
  }

  return null;
};
