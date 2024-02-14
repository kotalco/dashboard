import { formatCurrency } from "@/lib/utils";
import { getUserCredit } from "@/services/get-user-credit";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeInfo } from "lucide-react";

export const UserCreditBalance = async () => {
  const { creditBalance } = await getUserCredit();

  if (creditBalance?.balance) {
    return (
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="max-w-[200px] w-full text-muted-foreground"
              variant="outline"
            >
              <div className="w-full flex justify-between">
                <span>Account Credit</span>
                <span>
                  {formatCurrency(Math.abs(creditBalance.balance) || 0)}
                </span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <BadgeInfo className="w-10 h-10 text-muted-foreground" />
              </DialogTitle>
            </DialogHeader>
            <div className="text-muted-foreground">
              Account credit is a remaining balance after downgrading from a
              plan to another of less price. Account credit can be used in
              future payments.
            </div>
          </DialogContent>
        </Dialog>
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
