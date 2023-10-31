import "server-only";

import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Invoice } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export const getUpcomingInvoice = async (subscription_id: string) => {
  noStore();
  const url = qs.stringifyUrl({
    url: `/invoice/upcoming/${subscription_id}`,
    query: { provider: "stripe" },
  });

  const { data } = await server.get<Invoice>(url);

  return { invoice: data };
};
