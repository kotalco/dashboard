import { Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { getUserCredit } from "@/services/get-user-credit";

import { Skeleton } from "@/components/ui/skeleton";

export const UserCreditBalance = async () => {
  const { creditBalance } = await getUserCredit();

  if (creditBalance?.balance) {
    return (
      <div className="flex justify-end">
        <div className="flex justify-between w-full max-w-[200px] px-3 py-2 text-xs leading-6 rounded-xl bg-primary/5 text-foreground">
          <span className="flex items-center space-x-2">
            <span>Account Credit</span>
          </span>
          <span>{formatCurrency(Math.abs(creditBalance.balance) || 0)}</span>
        </div>
      </div>
    );
  }

  return null;
};

export const UserCreditBalanceSkeleton = () => {
  return (
    <div className="flex justify-end">
      <Skeleton className="w-[200px] h-10" />
    </div>
  );
};
