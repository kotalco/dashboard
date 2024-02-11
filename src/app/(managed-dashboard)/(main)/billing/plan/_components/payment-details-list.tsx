"use client";

import { Proration } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { SubscriptionStatus } from "@/enums";
import { useChangeSubscriptionModal } from "@/hooks/use-change-subscription-modal";
import { useAction } from "@/hooks/use-action";
import { updatePlan } from "@/actions/update-plan";

import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { PaymentElement } from "./payment-element";

interface PaymentDetailsListProps {
  children?: React.ReactNode;
  data?: Proration;
}

export const PaymentDetailsList = ({
  children,
  data,
}: PaymentDetailsListProps) => {
  const {
    onClose,
    setStep,
    planPrice,
    data: newSubscriptionInfo,
  } = useChangeSubscriptionModal();
  const {
    error,
    execute,
    data: status,
  } = useAction(updatePlan, {
    onSuccess: (data) => {
      if (data.status === SubscriptionStatus.Active) {
        onClose();
        setStep(1);
      }
    },
  });

  if (!data || planPrice === undefined || !newSubscriptionInfo) {
    return null;
  }

  const onSubmit = (formData: FormData) => {
    const cardId = formData.get("cardId") as string;

    execute({ ...newSubscriptionInfo, cardId, provider: "stripe" });
  };

  return (
    <form action={onSubmit} className="">
      <div>
        {data.amount_due > 0 && children}
        <ul>
          <li className="flex justify-between text-sm leading-9 opacity-70">
            <span>Plan Price</span>
            <span>{formatCurrency(planPrice)}</span>
          </li>
          <li className="flex justify-between text-sm leading-9 opacity-70">
            <span>Credit</span>
            <span>{formatCurrency(data.credit_balance)}</span>
          </li>
          {data.items.map(({ amount, description }) => (
            <li
              key={description}
              className="flex justify-between text-sm leading-9 opacity-70"
            >
              <span>{description}</span>
              <span>{formatCurrency(amount)}</span>
            </li>
          ))}
          <li className="flex justify-between text-sm font-bold leading-9">
            <span>Total Price</span>
            <span>{formatCurrency(data.amount_due)}</span>
          </li>
        </ul>
      </div>

      <SubmitError error={error} />

      {status?.client_secret && status.cardId && (
        <PaymentElement
          data={{ clientSecret: status.client_secret, cardId: status.cardId }}
        />
      )}

      <div className="mt-5">
        <SubmitButton
          className="w-full"
          // disabled={pending || disabled}
        >
          Pay {formatCurrency(data.amount_due)}
        </SubmitButton>
      </div>
    </form>
  );
};
