import { Suspense } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { InvoicePaymentDialog } from "./invoice-payment-dialog";
import { CardSelection } from "./card-selection";
import { InvoicePaymentForm } from "./invoice-payment-form";

export const InvoicePayment: React.FC<{ intentId: string }> = ({
  intentId,
}) => {
  return (
    <InvoicePaymentDialog intentId={intentId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Payment</DialogTitle>
        </DialogHeader>
        <InvoicePaymentForm>
          <Suspense fallback={<CardsSkeleton />}>
            <CardSelection />
          </Suspense>
        </InvoicePaymentForm>
      </DialogContent>
    </InvoicePaymentDialog>
  );
};

const CardsSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};
