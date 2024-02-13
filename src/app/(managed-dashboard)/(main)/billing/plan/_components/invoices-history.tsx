import { Fragment } from "react";
import { format, fromUnixTime } from "date-fns";

import { getInvoices } from "@/services/get-invoices";
import { InvoiceStatus } from "@/enums";
import { formatCurrency } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DownloadInvoice } from "./download-invoice";
import { InvoicePayment } from "./invoice-payment";
import { LoadMoreInvoicesButton } from "./load-more-invoices-button";

const INVOICES_LIMIT = 5;

interface InvoicesHistoryProps {
  limit?: string;
}

export const InvoicesHistory: React.FC<InvoicesHistoryProps> = async ({
  limit,
}) => {
  const currentLimit = Number(limit) || INVOICES_LIMIT;
  const { invoices } = await getInvoices(currentLimit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent className="text-center px-0">
        <table className="w-full">
          <tbody>
            {invoices.map(
              ({
                id,
                created_at,
                description,
                status,
                invoice_pdf,
                provider_payment_intent_id,
                amount_due,
              }) => (
                <Fragment key={id}>
                  <tr className="relative text-sm group hover:bg-muted transition-all duration-300">
                    <td
                      className={`flex items-center pt-3 space-x-3 max-w-fit pl-6`}
                    >
                      <span className="font-bold leading-6">
                        {format(fromUnixTime(created_at), "MMMM do, yyyy")}
                      </span>
                    </td>
                    <td className="text-muted-foreground leading-6 text-right">
                      {formatCurrency(amount_due)}
                    </td>
                    <td
                      className={`text-sm font-normal leading-6 text-right capitalize ${
                        InvoiceStatus.Paid ? "text-success" : "text-red-800"
                      }`}
                    >
                      {status}
                    </td>
                    <td className={`flex justify-end pr-6`}>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <DownloadInvoice invoicePDF={invoice_pdf} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="pb-3 text-xs leading-6 text-left"
                    >
                      {status !== InvoiceStatus.Paid && (
                        <InvoicePayment intentId={provider_payment_intent_id} />
                      )}
                    </td>
                    <td />
                  </tr>
                </Fragment>
              )
            )}
          </tbody>
        </table>
        {!(currentLimit > invoices.length) && <LoadMoreInvoicesButton />}
      </CardContent>
    </Card>
  );
};
