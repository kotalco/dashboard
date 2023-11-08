"use client";

import { ProrationFormState } from "@/types";
import { Alert } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import { StorageItems } from "@/enums";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UpdatePlanForm } from "./update-plan-form";

interface PaymentDetailsListProps {
  children?: React.ReactNode;
}

export const PaymentDetailsList: React.FC<PaymentDetailsListProps> = ({
  children,
}) => {
  const prorationFormState = useLocalStorage<ProrationFormState>(
    StorageItems.CHANGE_PLAN_DATA
  );

  if (!prorationFormState) return null;
  const { message, data } = prorationFormState;

  if (message) {
    return (
      <div className="w-7/12 pl-6">
        <Alert variant="destructive">{message}</Alert>
      </div>
    );
  }

  if (!data) return null;

  return (
    <UpdatePlanForm data={data}>
      <div>
        {data.proration.amount_due > 0 && children}
        <ul>
          <li className="flex justify-between text-sm leading-9 opacity-70">
            <span>Plan Price</span>
            <span>{formatCurrency(Number(data.price) * 100)}</span>
          </li>
          <li className="flex justify-between text-sm leading-9 opacity-70">
            <span>Credit</span>
            <span>{formatCurrency(data.proration.credit_balance)}</span>
          </li>
          {data.proration.items.map(({ amount, description }) => (
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
            <span>{formatCurrency(data.proration.amount_due)}</span>
          </li>
        </ul>
      </div>
    </UpdatePlanForm>
  );
};
