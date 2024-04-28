"use client";
import { useState, useTransition } from "react";
import { CreditCard } from "lucide-react";

import { Proration } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { createSetupIntent } from "@/lib/actions";
import { SubscriptionStatus } from "@/enums";
import { useChangeSubscriptionModal } from "@/hooks/use-change-subscription-modal";
import { useAction } from "@/hooks/use-action";
import { useShowCards } from "@/hooks/useShowCards";
import { updatePlan } from "@/actions/update-plan";

import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { PaymentElement } from "./payment-element";
import { AddNewCardForm } from "./add-new-card-form";

interface PaymentDetailsListProps {
  children?: React.ReactNode;
  cardsLength: number;
  data?: Proration;
}

export const PaymentDetailsList = ({
  children,
  cardsLength,
  data,
}: PaymentDetailsListProps) => {
  const [siSecret, setSiSecret] = useState<string | null>(null);
  const [addNewCardMessage, setAddNewCardMessage] = useState<string | null>(
    null
  );
  const { showCards, setShowCards } = useShowCards();
  const [pending, startTranstion] = useTransition();
  const {
    onClose,
    setStep,
    planPrice,
    data: newSubscriptionInfo,
    backStep,
  } = useChangeSubscriptionModal();
  const {
    error,
    execute,
    data: status,
  } = useAction(updatePlan, {
    onSuccess: (data) => {
      if (data.status === SubscriptionStatus.Active && !data.client_secret) {
        window.location.reload();
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

  const handlePayWithNewCard = () => {
    startTranstion(async () => {
      const { si_secret, message } = await createSetupIntent({
        message: null,
        si_secret: null,
      });

      if (message) {
        setAddNewCardMessage(message);
        return;
      }

      setSiSecret(si_secret);
      setShowCards(false);
    });
  };

  if (showCards) {
    return (
      <form action={onSubmit}>
        <div>
          {data.amount_due > 0 && (
            <>
              {children}

              <Button
                onClick={handlePayWithNewCard}
                type="button"
                variant="link"
                className="w-full"
                disabled={pending}
              >
                <CreditCard className="w-6 h-6 mr-2" />
                <span>
                  {cardsLength
                    ? "Use Another Payment Card"
                    : "Add New Payment Card"}
                </span>
              </Button>
            </>
          )}
          <ul>
            <li className="flex justify-between text-sm leading-9 opacity-70">
              <span>Plan Price</span>
              <span>{formatCurrency(planPrice)}</span>
            </li>
            {!!data.credit_balance && (
              <li className="flex justify-between text-sm leading-9 opacity-70">
                <span>Credit</span>
                <span>{formatCurrency(data.credit_balance)}</span>
              </li>
            )}
            {data.items.map(({ amount, description }) => (
              <li
                key={description}
                className="flex justify-between text-sm leading-9 opacity-70"
              >
                <span>{description}</span>
                <span>{formatCurrency(amount)}</span>
              </li>
            ))}
            <Separator className="my-2" />
            <li className="flex justify-between text-xl leading-9">
              <span>Total Price</span>
              <span>{formatCurrency(data.amount_due)}</span>
            </li>
          </ul>
        </div>

        <SubmitError error={error} />

        {addNewCardMessage && <SubmitError error={addNewCardMessage} />}

        {status?.client_secret && status.cardId && (
          <PaymentElement
            data={{ clientSecret: status.client_secret, cardId: status.cardId }}
          />
        )}

        <div className="mt-5">
          <SubmitButton
            className="w-full"
            disabled={data.amount_due > 0 && cardsLength === 0}
          >
            Pay {formatCurrency(data.amount_due)}
          </SubmitButton>
        </div>

        <div className="text-center">
          <Button variant="link" type="button" onClick={backStep}>
            Back to Plans
          </Button>
        </div>
      </form>
    );
  }

  if (!showCards && siSecret) {
    return <AddNewCardForm si_secret={siSecret} />;
  }

  return null;
};
