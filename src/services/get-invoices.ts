import "server-only";

import { server } from "@/lib/server-instance";
import { Invoice } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export const getInvoices = async (subscription_id: string) => {
  noStore();
  const { data } = await server.get<Invoice[]>(
    `/subscriptions/${subscription_id}/invoices`
  );

  return { invoices: data };
};
