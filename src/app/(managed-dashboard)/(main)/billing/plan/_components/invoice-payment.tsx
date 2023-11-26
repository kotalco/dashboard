// import { useFormState, useFormStatus } from "react-dom";

// import { Button } from "@/components/ui/button";
// import { prepareInvoicePayment } from "@/lib/actions";
// import { Loader2 } from "lucide-react";
import { InvoicePaymentForm } from "./invoice-payment-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoicePaymentDialog } from "./invoice-payment-dialog";
import { Suspense } from "react";
import { CardSelection } from "./card-selection";
import { Skeleton } from "@/components/ui/skeleton";

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
