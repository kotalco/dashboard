import Image from "next/image";
import { Fragment } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PaymentCard, Proration } from "@/types";
import { Alert } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface PaymentDetailsListProps {
  proration?: Proration;
  price?: string;
  isPending: boolean;
  message?: string;
  cards: PaymentCard[];
}

export const PaymentDetailsList: React.FC<PaymentDetailsListProps> = ({
  proration,
  price,
  isPending,
  message,
  cards,
}) => {
  if (isPending) {
    return (
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
    );
  }

  if (message) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  if (!proration) return null;

  return (
    <>
      {!cards?.length && (
        <div className="flex flex-col items-center py-12 text-center">
          <CreditCard className="w-12 h-12" />
          <h3 className="mt-5 text-sm font-semibold">
            There is no any payment cards added as yet!
          </h3>
          <p className="mt-2 text-xs font-normal leading-5 opacity-50">
            Add your card here to be able to create your subscription.
          </p>
        </div>
      )}
      <ul>
        <li className="flex justify-between text-sm leading-9 opacity-70">
          <span>Plan Price</span>
          <span>{formatCurrency(Number(price) * 100)}</span>
        </li>
        <li className="flex justify-between text-sm leading-9 opacity-70">
          <span>Credit</span>
          <span>{formatCurrency(proration.credit_balance)}</span>
        </li>
        {proration.items.map(({ amount, description }) => (
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
          <span>{formatCurrency(proration.amount_due)}</span>
        </li>
      </ul>
      <PayButton amount={proration.amount_due} />
    </>
  );
};

const PayButton: React.FC<{ disabled?: boolean; amount: number }> = ({
  disabled = false,
  amount,
}) => {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button className="w-full" disabled={pending || disabled}>
        Pay {formatCurrency(amount)}
      </Button>
    </div>
  );
};
