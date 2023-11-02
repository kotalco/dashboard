import { Fragment } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, fromUnixTime } from "date-fns";

import { getCurrentSubscription } from "@/services/get-current-subscription";
import { getInvoices } from "@/services/get-invoices";
import { File } from "lucide-react";
import { InvoiceStatus } from "@/enums";
import { formatCurrency } from "@/lib/utils";
import { DownloadInvoice } from "./download-invoice";
import { InvoicePayment } from "./invoice-payment";

export const InvoicesHistory = async () => {
  const { subscription } = await getCurrentSubscription();
  const { invoices } = await getInvoices(subscription.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <tr className="relative text-sm border-t border-gray-200 first:border-0">
                    <td
                      className={`flex items-center pt-3 align-middle space-x-3 max-w-fit`}
                    >
                      <File className="w-6 h-6" />
                      <span className="font-normal leading-6">{id}</span>
                    </td>
                    <td className="pt-3 font-medium leading-6">
                      {description}
                    </td>
                    <td className="pt-3 font-normal leading-6 text-right opacity-70">
                      {format(fromUnixTime(created_at), "MMMM do, yyyy")}
                    </td>
                    <td className="pt-3 font-bold leading-6 text-right align-middle">
                      {formatCurrency(amount_due)}
                    </td>
                    <td
                      className={`text-sm font-normal align-middle pt-3 leading-6 text-right capitalize ${
                        InvoiceStatus.Paid ? "text-success" : "text-red-800"
                      }`}
                    >
                      {status}
                    </td>
                    <td className={`flex justify-end pt-3`}>
                      <DownloadInvoice invoicePDF={invoice_pdf} />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={5}
                      className="pb-3 text-xs leading-6 text-right"
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
      </CardContent>

      {/* {clientSecret && (
        <Elements
          options={{ clientSecret, appearance: { theme: "stripe" } }}
          stripe={stripe}
        >
          <Modal
            open={open}
            onClose={onClose}
            title="Invoice Payment"
            withCancelButton={false}
          >
            <ProcessInvoicePayment
              clientSecret={clientSecret}
              onClose={onClose}
            />
          </Modal>
        </Elements>
      )} */}
    </Card>
  );
};
